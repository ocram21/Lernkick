// Hit areas centered on the printed number circles. Original illustrations remain untouched.
export const boardTargets:Record<string,readonly (readonly [number,number])[]>={
 'anatomie-auge-01':[[.242,.18],[.329,.30],[.418,.45],[.282,.565],[.197,.65],[.344,.67],[.355,.86],[.059,.78],[.518,.45],[.623,.51],[.712,.55],[.782,.22],[.898,.39],[.914,.57],[.97,.68],[.863,.20]],
 'biologie-ohr-01':[[.073,.328],[.324,.587],[.466,.626],[.499,.332],[.566,.406],[.64,.542],[.747,.861],[.919,.674],[.76,.217],[.954,.36]]
};
export function assignTerm(order:number[],source:number,target:number){if(source<0||target<0||source>=order.length||target>=order.length)return order;const next=[...order];[next[source],next[target]]=[next[target],next[source]];return next;}
