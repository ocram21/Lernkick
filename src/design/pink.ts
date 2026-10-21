import tokens from './pink.json';
for(const [key,value] of Object.entries(tokens))document.documentElement.style.setProperty('--pink-'+key,value);
