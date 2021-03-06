---
title: Valgrind Basics
layout: post
---

## February 1 - 3, 2018
# Tools for debugging Memory in JavaScript

(or rather, musings after reading the docs of chrome and firefox memory tools)

Yesterday I wrote a little about memory in JavaScript, and today I dug in a bit deeper into the docs. I had a few questions as I was reading and I've taken notes. That is pretty much what follows!


### Memory Terminology

Both Chrome and Firefox had some documentation of terminology, but Chrome's was more complete. I
also experimented quite a bit with the two tool sets to see what I could find to supplement the
documentation. Here is what I gathered:

Basics:

* graph - a collection of nodes connected by edges. It can be circular, that means that two nodes
  can reference the same node.

* primitive - a JavaScript primitive, such as a number, boolean, string, undefined, null etc.

  ```javascript
  const foo = { bar: { baz: "hi" } }
  ```
  `"hi"` is a primitive.

* node - an object, a piece of memory.

  In `const foo = { bar: { baz: "hi" } }`, `foo`, `bar`, and `baz` are nodes.

* edge - the connection between two nodes, a property or a reference. The following is chrome
  specific:

  In `const foo = { bar: { baz: "hi" } }`, `bar` is a reference to another object or data, and therefore an edge.

  If I understood correctly, chrome is simplifying the data a little so that you do not see more information than you need to,
  and has named edges after the properties that they point to while references have the names of the
  variables that they are assigned. This isn't the case with firefox, which makes it more difficult
  to understand what is going on, but is possibly a more accurate representation?

* dominators - an object that acts as an intermediary for other objects. For example, if an object
  is kept alive by a scope, then the scope is the dominator. In `const foo = { bar: { baz: "hi" } }`, `bar` is the dominator for `baz`. There is only on dominator for a given path. In `cont foo2 = { baz: foo, bar: foo}`, the dominator of `foo` is `foo2`, not `baz` or `bar`.

* heap - memory that has been allocated in no particular order.

Garbage Collector terms:

* Live or living nodes - nodes that are currently in use by the page or program
* GC - Garbage Collector
* GC Roots - the root node from which a garbage collector starts its search from for "living nodes".
  There is a representation of this in firefox, but not in chrome.

* Objects retaining tree is the tree built from the GC Roots and contains all "living" objects to
  represent one instance of the graph. This is chrome specific, but it looks like they have taken
  one specific path through the graph and represented it as a tree.

Size Terminology:

* shallow size - the size of the object itself. In `const foo = { bar: { baz: "hi" } }`, the shallow
  size of `baz` is 32 bytes, because that is the size of the string "hi".

* retained size - the size of the object plus the objects that it keeps alive, In `const foo = { bar: { baz: "hi" } }`, the retained size of `bar` is 64 bits, because it is the cumulative size of `bar` and `baz` together. However, the cumulative size of `baz` is still 32, because it has no knowledge of `bar`. In other words, while the only reason `bar` exists is to contain a definition of `baz`, according to the graph, it is what is keeping alive `baz`, not the other way around.

You can find more information about terminology from both the [Chrome
docs](https://developers.google.com/web/tools/chrome-devtools/memory-problems/memory-101) and from
the [MDN docs](https://developer.mozilla.org/en-US/docs/Tools/Memory/Dominators).

### Basics of memory profiling

Regardless of which tools you use, the following can be done:

You can take `heap snapshots`. What this does is takes a picture of what the heap currently looks
like.

Let's use a blank page and take a snapshot before adding something in the console and after:
Navigate your browser to `data:,`:

Then, add the following to the console: `const foo = { toss: "hi" }`
Why do we do this? Because the first time you use the console, some new objects will be added to
memory, we don't want this noise in our profiling, so we are getting things started ahead of time.

You can take a heap snapshot via the main page in chrome, or from its profiles button,
while in firefox, you can take a heap snapshot from the main page of the memory tab, or from the snapshot
icon:

![2018-02-02-chrome-ff-snapshot](./images/2018-02-02-ff-and-chrome.png)


Now you can go ahead and take your first snapshot in the memory panel of the browser of your choice!

![2018-02-02-first-snap](./images/2018-02-02-ff-and-chrome-first-snap.png)

We can now add our test object in the console:

```javascript
const myProfilingObject = { bar: { baz: "hi" } };
```
And take another snapshot!

![2018-02-02-first-snap](./images/2018-02-02-ff-and-chrome-second-snap.png)

Now we can compare the two. In Firefox you do this with the compare
button, and select the baseline snapshot and the snapshot you want to compare

![2018-02-02-compare-snapff1](./images/2018-02-02-ff-compare-1.png)
![2018-02-02-compare-snapff2](./images/2018-02-02-ff-compare-2.png)


and in chrome, there is a dropdown to select which snapshot you want to compare

![2018-02-02-compare-snapc](./images/2018-02-02-chrome-compare-snap.png)

Here we can see the two comparisons that we get out of each browser. They both have a lot of
information and they are both different. For example chrome's is much more paired down and
organized, while Firefox shows you all of the roots and information about them.

![2018-02-02-compare](./images/2018-02-02-compare-both.png)

A few notes: the tree view in firefox isn't very useful, and chrome has a few more tools than
firefox, such as recording memory usage over time -- however performance tools are also available!


