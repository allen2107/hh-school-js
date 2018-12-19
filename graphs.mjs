export class LazyGraph {
    constructor(graph){
        this.graph = graph;
        this.values = {};
    }

    calcVertex(v) {
        this.checkResolvable(v);

        const calc = vertex => {
            if (Object.keys(this.values).includes(vertex)) {
                return this.values[vertex];
            }
            let arguments_array = getFunctionParams(this.graph[vertex])
                .map(arg => calc(arg));
            this.values[vertex] = this.graph[vertex](...arguments_array);

            return this.values[vertex];
        };

        return calc(v);
    }

    checkResolvable(vertex) {
        let references = new Set();
        let resolved = new Set();

        const resolve = (key) => {
            if (!this.graph.hasOwnProperty(key)) {
                throw new Error('Graph has no vertex with name ' + key);
            }
            references.add(key);
            let params = getFunctionParams(this.graph[key]);
            params.forEach(p => {
                if (references.has(p) && !resolved.has(p)){
                    throw new Error('Circular reference with key ' + p);
                }
                resolve(p);
            });

            resolved.add(key);
        };

        resolve(vertex);
    };
}

export class EagerGraph {
    constructor(graph){
        let eager = new LazyGraph(graph);
        Object.keys(graph).forEach(key => eager.calcVertex(key));
        return eager;
    }
}

// not mine! :)
// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
const getFunctionParams = func => {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
};
