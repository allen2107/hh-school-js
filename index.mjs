import { LazyGraph } from "./graphs";
import {EagerGraph} from "./graphs.mjs";

const cirtucalRefGraph = {
  n: (a) => a,  
  a: (n) => n,
  z: (x) => x,
  x: (z) => z,
};

const myAmazingGraph = {
    n: (xs) => xs.length,
    m: (xs, n) => xs.reduce((store, item) => item + store, 0) / n,
    m2: (xs, n) => xs.reduce((store, item) => item * store, 1) / n,
    v: (m, m2) => m*m - m2,
    xs: () => [1, 2, 3]
};

const customAmazingGraph = {
    1: () => null,
    null: (q, w, e) => q + w + e,
    q: (w, e) => 'q' + w + e,
    w: (e) => 'w' + e,
    e: () => 'e'
};

const iter_graph_by_keys = (object, graph) => {
    console.log('Iterating graph builder by object:', object);

    Object.keys(object).forEach(key => {
        try {
            console.log('Vertex ', key, ': ', graph.calcVertex(key))
        } catch (e) {
            console.log(e);
        }
    });
};

iter_graph_by_keys(myAmazingGraph, new LazyGraph(myAmazingGraph));
iter_graph_by_keys(customAmazingGraph, new EagerGraph(customAmazingGraph));
iter_graph_by_keys(cirtucalRefGraph, new LazyGraph(cirtucalRefGraph));


