"""Import only the supplied ZIP assets; fail before writing on inconsistent input."""
import hashlib, json, struct, sys, zipfile
from pathlib import Path
root = Path(__file__).resolve().parent.parent

def prepare(source=root / 'Tafeln'):
    catalog, outputs, ids, names = [], {}, set(), set()
    for archive in sorted(source.glob('*.zip')):
        with zipfile.ZipFile(archive) as package:
            files = package.namelist()
            if any('/' in name or '\\' in name for name in files):
                raise ValueError(f'{archive.name}: Nur einfache Dateinamen sind erlaubt.')
            jsons = [name for name in files if name.endswith('.json')]
            if len(jsons) != 1:
                raise ValueError(f'{archive.name}: Genau eine JSON-Zuordnung erforderlich.')
            raw = json.loads(package.read(jsons[0]))
            identity, image = raw.get('id'), raw.get('image')
            if not identity or identity in ids:
                raise ValueError(f'{archive.name}: Fehlende oder doppelte Tafel-ID {identity!r}.')
            if image not in files or not image.endswith('.png'):
                raise ValueError(f'{archive.name}: Bild {image!r} fehlt.')
            items = raw.get('items', [])
            numbers = [item.get('number') for item in items]
            if not items or any(type(n) is not int or n < 1 for n in numbers) or numbers != sorted(set(numbers)):
                raise ValueError(f'{archive.name}: Nummern müssen eindeutig und aufsteigend sein.')
            if any(not isinstance(item.get('term'), str) or not item['term'].strip() for item in items):
                raise ValueError(f'{archive.name}: Ein Begriff ist leer.')
            interaction = raw.get('game', raw.get('interaction', {}))
            if interaction.get('type') not in ('numbered-image-sort', 'reorder'):
                raise ValueError(f'{archive.name}: Unbekanntes Spielschema.')
            png = package.read(image)
            if png[:8] != b'\x89PNG\r\n\x1a\n':
                raise ValueError(f'{archive.name}: Keine gültige PNG-Datei.')
            width, height = struct.unpack('>II', png[16:24])
            review = raw.get('review', {})
            catalog.append(dict(id=identity, title=raw['title'], subject=raw['subject'], image='boards/original/' + image,
                width=width, height=height, entries=items, instructions=raw.get('instructions', 'Sortiere die Begriffe passend zu den Bildnummern. Tippe auf Check.'),
                status='draft', approvedForTeaching=False, hints=[review.get('notes', raw.get('qualityNote', 'Fachprüfung ausstehend.'))],
                source=archive.name, sha256=hashlib.sha256(png).hexdigest()))
            ids.add(identity)
            for name in files:
                if name in names: raise ValueError(f'Doppelter Asset-Dateiname: {name}')
                names.add(name)
                outputs[root / 'public/boards/original' / name] = package.read(name)
    if len(catalog) != 2:
        raise ValueError('Für diesen Auftrag werden genau die beiden Pakete Auge und Ohr erwartet.')
    return catalog, outputs

if __name__ == '__main__':
    try:
        catalog, outputs = prepare()
        for path, content in outputs.items():
            if path.exists() and path.read_bytes() != content:
                raise ValueError(f'{path}: Vorhandenes Original unterscheidet sich; kein Überschreiben.')
        for path, content in outputs.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
        target = root / 'src/boards/catalog.json'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
        for board in catalog:
            print(f"Entwurf importiert: {board['title']} ({len(board['entries'])} Einträge); Original unverändert.")
    except (ValueError, KeyError, json.JSONDecodeError, zipfile.BadZipFile) as error:
        print(f'Tafel-Import abgebrochen: {error}', file=sys.stderr)
        sys.exit(1)
