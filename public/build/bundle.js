<<<<<<< HEAD

(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.50.0 */

    function create_fragment$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.50.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.50.0 */
    const file$5 = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$5(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$5, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Header.svelte generated by Svelte v3.50.0 */
    const file$4 = "src\\components\\Header.svelte";

    // (12:4) <Link to="/">
    function create_default_slot_2$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Start";
    			attr_dev(div, "class", "svelte-jn70l7");
    			add_location(div, file$4, 11, 17, 251);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(12:4) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:4) <Link to="texte">
    function create_default_slot_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Texte";
    			attr_dev(div, "class", "svelte-jn70l7");
    			add_location(div, file$4, 12, 21, 297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(13:4) <Link to=\\\"texte\\\">",
    		ctx
    	});

    	return block;
    }

    // (14:4) <Link to="kontakt">
    function create_default_slot$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Kontakt";
    			attr_dev(div, "class", "svelte-jn70l7");
    			add_location(div, file$4, 13, 23, 345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(14:4) <Link to=\\\"kontakt\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let header;
    	let nav;
    	let a;
    	let div;
    	let t0;
    	let link0;
    	let t1;
    	let link1;
    	let t2;
    	let link2;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "texte",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "kontakt",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav = element("nav");
    			a = element("a");
    			div = element("div");
    			t0 = space();
    			create_component(link0.$$.fragment);
    			t1 = space();
    			create_component(link1.$$.fragment);
    			t2 = space();
    			create_component(link2.$$.fragment);
    			attr_dev(div, "class", "svelte-jn70l7");
    			add_location(div, file$4, 9, 22, 211);
    			attr_dev(a, "href", "https://www.startpage.com/do/dsearch?query=Lutz+V%C3%B6ssing");
    			attr_dev(a, "id", "nav__lutz");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-jn70l7");
    			add_location(a, file$4, 6, 4, 88);
    			attr_dev(nav, "class", "svelte-jn70l7");
    			add_location(nav, file$4, 5, 2, 77);
    			attr_dev(header, "class", "svelte-jn70l7");
    			add_location(header, file$4, 4, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, a);
    			append_dev(a, div);
    			append_dev(nav, t0);
    			mount_component(link0, nav, null);
    			append_dev(nav, t1);
    			mount_component(link1, nav, null);
    			append_dev(nav, t2);
    			mount_component(link2, nav, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\About.svelte generated by Svelte v3.50.0 */

    const file$3 = "src\\pages\\About.svelte";

    function create_fragment$3(ctx) {
    	let div0;
    	let t1;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Geboren 1990 in Höxter, Kurzaufenthalt in Mittelsachsen, Studium der\r\n  Philosophie und Literaturwissenschaft in Wien und Berlin, lebt und arbeitet in\r\n  Berlin.";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Beiträge für skug, GROOVE, Spex, wina, Ventil-Verlag, Facebook, Radio und\r\n  diverse Arbeiten als Ghostwriter im Bereich Musik und Kultur";
    			attr_dev(div0, "class", "bio");
    			add_location(div0, file$3, 3, 0, 23);
    			attr_dev(div1, "class", "bio");
    			add_location(div1, file$3, 8, 0, 215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Kontakt.svelte generated by Svelte v3.50.0 */

    const file$2 = "src\\pages\\Kontakt.svelte";

    function create_fragment$2(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			div.textContent = "mailto:lutz@gott.info";
    			if (!src_url_equal(img.src, img_src_value = "/lutz-foto.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Lutz lesend");
    			attr_dev(img, "class", "svelte-1jzeaqs");
    			add_location(img, file$2, 2, 4, 25);
    			add_location(div, file$2, 3, 4, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Kontakt', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Kontakt> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Kontakt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Kontakt",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Texte.svelte generated by Svelte v3.50.0 */

    const file$1 = "src\\pages\\Texte.svelte";

    function create_fragment$1(ctx) {
    	let h2;
    	let span;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			span = element("span");
    			span.textContent = "Texte (Auswahl)";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Die üblichen Bilder brechen (in: Wina - Das jüdische Stadtmagazin)";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Braune Grauzone (in: skug | MUSIKKULTUR)";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Flying Lotus' „Yasuke”: „Nichts entsteht ohne Opfer, Schmerz und Blut.”\r\n      (in: Groove)";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "„Anne Rolfs” & „Karen Dalton” (in: These Girls - Ein Streifzug durch die\r\n      feministische Musikgeschichte)";
    			attr_dev(span, "class", "svelte-tbq4dj");
    			add_location(span, file$1, 3, 4, 27);
    			attr_dev(h2, "class", "svelte-tbq4dj");
    			add_location(h2, file$1, 3, 0, 23);
    			attr_dev(a0, "href", "https://www.wina-magazin.at/die-ueblichen-bilder-brechen/");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$1, 6, 4, 80);
    			attr_dev(li0, "class", "svelte-tbq4dj");
    			add_location(li0, file$1, 5, 2, 70);
    			attr_dev(a1, "href", "https://skug.at/braune-grauzone/");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$1, 13, 4, 285);
    			attr_dev(li1, "class", "svelte-tbq4dj");
    			add_location(li1, file$1, 12, 2, 275);
    			attr_dev(a2, "href", "https://groove.de/2021/06/18/flying-lotus-yasuke-nichts-entsteht-ohne-opfer-schmerz-und-blut/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$1, 18, 4, 425);
    			attr_dev(li2, "class", "svelte-tbq4dj");
    			add_location(li2, file$1, 17, 2, 415);
    			attr_dev(a3, "href", "https://www.ventil-verlag.de/titel/1850/these-girls/");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$1, 26, 4, 691);
    			attr_dev(li3, "class", "svelte-tbq4dj");
    			add_location(li3, file$1, 25, 2, 681);
    			attr_dev(ul, "class", "svelte-tbq4dj");
    			add_location(ul, file$1, 4, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, span);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Texte', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Texte> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Texte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Texte",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.50.0 */
    const file = "src\\App.svelte";

    // (16:4) <Route path="/">
    function create_default_slot_3(ctx) {
    	let div;
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(about.$$.fragment);
    			attr_dev(div, "class", "contentbox svelte-14t1s5p");
    			add_location(div, file, 15, 20, 376);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(about, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(about);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(16:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:4) <Route path="kontakt">
    function create_default_slot_2(ctx) {
    	let div;
    	let kontakt;
    	let current;
    	kontakt = new Kontakt({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(kontakt.$$.fragment);
    			attr_dev(div, "class", "contentbox svelte-14t1s5p");
    			add_location(div, file, 16, 26, 450);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(kontakt, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(kontakt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(kontakt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(kontakt);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(17:4) <Route path=\\\"kontakt\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:4) <Route path="texte">
    function create_default_slot_1(ctx) {
    	let div;
    	let texte;
    	let current;
    	texte = new Texte({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(texte.$$.fragment);
    			attr_dev(div, "class", "contentbox svelte-14t1s5p");
    			add_location(div, file, 17, 24, 524);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(texte, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(texte.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(texte.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(texte);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(18:4) <Route path=\\\"texte\\\">",
    		ctx
    	});

    	return block;
    }

    // (10:0) <Router>
    function create_default_slot(ctx) {
    	let header;
    	let t0;
    	let main;
    	let div;
    	let t1;
    	let h1;
    	let span;
    	let t3;
    	let route0;
    	let t4;
    	let route1;
    	let t5;
    	let route2;
    	let current;
    	header = new Header({ $$inline: true });

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "kontakt",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "texte",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			t1 = space();
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Lutz Vössing";
    			t3 = space();
    			create_component(route0.$$.fragment);
    			t4 = space();
    			create_component(route1.$$.fragment);
    			t5 = space();
    			create_component(route2.$$.fragment);
    			attr_dev(div, "id", "checkgrid");
    			attr_dev(div, "class", "svelte-14t1s5p");
    			add_location(div, file, 13, 4, 294);
    			attr_dev(span, "class", "svelte-14t1s5p");
    			add_location(span, file, 14, 8, 325);
    			attr_dev(h1, "class", "svelte-14t1s5p");
    			add_location(h1, file, 14, 4, 321);
    			attr_dev(main, "class", "svelte-14t1s5p");
    			add_location(main, file, 12, 2, 283);
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t1);
    			append_dev(main, h1);
    			append_dev(h1, span);
    			append_dev(main, t3);
    			mount_component(route0, main, null);
    			append_dev(main, t4);
    			mount_component(route1, main, null);
    			append_dev(main, t5);
    			mount_component(route2, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(10:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		About,
    		Kontakt,
    		Texte,
    		Router,
    		Route
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
=======
var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(n)}function s(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let i,u;function a(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function l(t,e,n){t.$$.on_destroy.push(a(e,n))}function f(t,e,n,r){if(t){const o=p(t,e,n,r);return t[0](o)}}function p(t,n,r,o){return t[1]&&o?e(r.ctx.slice(),t[1](o(n))):r.ctx}function $(t,e,n,r){if(t[2]&&r){const o=t[2](r(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|o[r];return t}return e.dirty|o}return e.dirty}function d(t,e,n,r,o,s){if(o){const c=p(e,n,r,s);t.p(c,o)}}function h(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}function m(t){const e={};for(const n in t)"$"!==n[0]&&(e[n]=t[n]);return e}function g(t,e){const n={};e=new Set(e);for(const r in t)e.has(r)||"$"===r[0]||(n[r]=t[r]);return n}function b(t,e){t.appendChild(e)}function v(t,e,n){t.insertBefore(e,n||null)}function y(t){t.parentNode.removeChild(t)}function x(t){return document.createElement(t)}function w(t){return document.createTextNode(t)}function k(){return w(" ")}function _(){return w("")}function E(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function j(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const r in e)null==e[r]?t.removeAttribute(r):"style"===r?t.style.cssText=e[r]:"__value"===r?t.value=t[r]=e[r]:n[r]&&n[r].set?t[r]=e[r]:E(t,r,e[r])}function z(t){u=t}function L(){if(!u)throw new Error("Function called outside component initialization");return u}function S(){const t=L();return(e,n,{cancelable:r=!1}={})=>{const o=t.$$.callbacks[e];if(o){const s=function(t,e,{bubbles:n=!1,cancelable:r=!1}={}){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,n,r,e),o}(e,n,{cancelable:r});return o.slice().forEach((e=>{e.call(t,s)})),!s.defaultPrevented}return!0}}function C(t,e){return L().$$.context.set(t,e),e}function P(t){return L().$$.context.get(t)}const B=[],R=[],M=[],O=[],q=Promise.resolve();let A=!1;function K(t){M.push(t)}const T=new Set;let N=0;function D(){const t=u;do{for(;N<B.length;){const t=B[N];N++,z(t),G(t.$$)}for(z(null),B.length=0,N=0;R.length;)R.pop()();for(let t=0;t<M.length;t+=1){const e=M[t];T.has(e)||(T.add(e),e())}M.length=0}while(B.length);for(;O.length;)O.pop()();A=!1,T.clear(),z(t)}function G(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(K)}}const H=new Set;let U;function V(){U={r:0,c:[],p:U}}function F(){U.r||o(U.c),U=U.p}function I(t,e){t&&t.i&&(H.delete(t),t.i(e))}function W(t,e,n,r){if(t&&t.o){if(H.has(t))return;H.add(t),U.c.push((()=>{H.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}else r&&r()}function Y(t,e){const n={},r={},o={$$scope:1};let s=t.length;for(;s--;){const c=t[s],i=e[s];if(i){for(const t in c)t in i||(r[t]=1);for(const t in i)o[t]||(n[t]=i[t],o[t]=1);t[s]=i}else for(const t in c)o[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}function J(t){return"object"==typeof t&&null!==t?t:{}}function Q(t){t&&t.c()}function X(t,e,r,c){const{fragment:i,on_mount:u,on_destroy:a,after_update:l}=t.$$;i&&i.m(e,r),c||K((()=>{const e=u.map(n).filter(s);a?a.push(...e):o(e),t.$$.on_mount=[]})),l.forEach(K)}function Z(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function tt(t,e){-1===t.$$.dirty[0]&&(B.push(t),A||(A=!0,q.then(D)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function et(e,n,s,c,i,a,l,f=[-1]){const p=u;z(e);const $=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:i,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(p?p.$$.context:[])),callbacks:r(),dirty:f,skip_bound:!1,root:n.target||p.$$.root};l&&l($.root);let d=!1;if($.ctx=s?s(e,n.props||{},((t,n,...r)=>{const o=r.length?r[0]:n;return $.ctx&&i($.ctx[t],$.ctx[t]=o)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](o),d&&tt(e,t)),n})):[],$.update(),d=!0,o($.before_update),$.fragment=!!c&&c($.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);$.fragment&&$.fragment.l(t),t.forEach(y)}else $.fragment&&$.fragment.c();n.intro&&I(e.$$.fragment),X(e,n.target,n.anchor,n.customElement),D()}z(p)}class nt{$destroy(){Z(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const rt=[];function ot(e,n=t){let r;const o=new Set;function s(t){if(c(e,t)&&(e=t,r)){const t=!rt.length;for(const t of o)t[1](),rt.push(t,e);if(t){for(let t=0;t<rt.length;t+=2)rt[t][0](rt[t+1]);rt.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(c,i=t){const u=[c,i];return o.add(u),1===o.size&&(r=n(s)||t),c(e),()=>{o.delete(u),0===o.size&&(r(),r=null)}}}}function st(e,n,r){const c=!Array.isArray(e),i=c?[e]:e,u=n.length<2;return l=e=>{let r=!1;const l=[];let f=0,p=t;const $=()=>{if(f)return;p();const r=n(c?l[0]:l,e);u?e(r):p=s(r)?r:t},d=i.map(((t,e)=>a(t,(t=>{l[e]=t,f&=~(1<<e),r&&$()}),(()=>{f|=1<<e}))));return r=!0,$(),function(){o(d),p()}},{subscribe:ot(r,l).subscribe};var l}const ct={},it={};function ut(t){return{...t.location,state:t.history.state,key:t.history.state&&t.history.state.key||"initial"}}const at=function(t,e){const n=[];let r=ut(t);return{get location(){return r},listen(e){n.push(e);const o=()=>{r=ut(t),e({location:r,action:"POP"})};return t.addEventListener("popstate",o),()=>{t.removeEventListener("popstate",o);const r=n.indexOf(e);n.splice(r,1)}},navigate(e,{state:o,replace:s=!1}={}){o={...o,key:Date.now()+""};try{s?t.history.replaceState(o,null,e):t.history.pushState(o,null,e)}catch(n){t.location[s?"replace":"assign"](e)}r=ut(t),n.forEach((t=>t({location:r,action:"PUSH"})))}}}(Boolean("undefined"!=typeof window&&window.document&&window.document.createElement)?window:function(t="/"){let e=0;const n=[{pathname:t,search:""}],r=[];return{get location(){return n[e]},addEventListener(t,e){},removeEventListener(t,e){},history:{get entries(){return n},get index(){return e},get state(){return r[e]},pushState(t,o,s){const[c,i=""]=s.split("?");e++,n.push({pathname:c,search:i}),r.push(t)},replaceState(t,o,s){const[c,i=""]=s.split("?");n[e]={pathname:c,search:i},r[e]=t}}}}()),{navigate:lt}=at,ft=/^:(.+)/;function pt(t,e){return t.substr(0,e.length)===e}function $t(t){return"*"===t[0]}function dt(t){return t.replace(/(^\/+|\/+$)/g,"").split("/")}function ht(t){return t.replace(/(^\/+|\/+$)/g,"")}function mt(t,e){return{route:t,score:t.default?0:dt(t.path).reduce(((t,e)=>(t+=4,!function(t){return""===t}(e)?!function(t){return ft.test(t)}(e)?$t(e)?t-=5:t+=3:t+=2:t+=1,t)),0),index:e}}function gt(t,e){let n,r;const[o]=e.split("?"),s=dt(o),c=""===s[0],i=function(t){return t.map(mt).sort(((t,e)=>t.score<e.score?1:t.score>e.score?-1:t.index-e.index))}(t);for(let t=0,o=i.length;t<o;t++){const o=i[t].route;let u=!1;if(o.default){r={route:o,params:{},uri:e};continue}const a=dt(o.path),l={},f=Math.max(s.length,a.length);let p=0;for(;p<f;p++){const t=a[p],e=s[p];if(void 0!==t&&$t(t)){l["*"===t?"*":t.slice(1)]=s.slice(p).map(decodeURIComponent).join("/");break}if(void 0===e){u=!0;break}let n=ft.exec(t);if(n&&!c){const t=decodeURIComponent(e);l[n[1]]=t}else if(t!==e){u=!0;break}}if(!u){n={route:o,params:l,uri:"/"+s.slice(0,p).join("/")};break}}return n||r||null}function bt(t,e){return t+(e?`?${e}`:"")}function vt(t,e){return`${ht("/"===e?t:`${ht(t)}/${ht(e)}`)}/`}function yt(t){let e;const n=t[9].default,r=f(n,t,t[8],null);return{c(){r&&r.c()},m(t,n){r&&r.m(t,n),e=!0},p(t,[o]){r&&r.p&&(!e||256&o)&&d(r,n,t,t[8],e?$(n,t[8],o,null):h(t[8]),null)},i(t){e||(I(r,t),e=!0)},o(t){W(r,t),e=!1},d(t){r&&r.d(t)}}}function xt(t,e,n){let r,o,s,{$$slots:c={},$$scope:i}=e,{basepath:u="/"}=e,{url:a=null}=e;const f=P(ct),p=P(it),$=ot([]);l(t,$,(t=>n(6,o=t)));const d=ot(null);let h=!1;const m=f||ot(a?{pathname:a}:at.location);l(t,m,(t=>n(5,r=t)));const g=p?p.routerBase:ot({path:u,uri:u});l(t,g,(t=>n(7,s=t)));const b=st([g,d],(([t,e])=>{if(null===e)return t;const{path:n}=t,{route:r,uri:o}=e;return{path:r.default?n:r.path.replace(/\*.*$/,""),uri:o}}));var v;return f||(v=()=>at.listen((t=>{m.set(t.location)})),L().$$.on_mount.push(v),C(ct,m)),C(it,{activeRoute:d,base:g,routerBase:b,registerRoute:function(t){const{path:e}=s;let{path:n}=t;if(t._path=n,t.path=vt(e,n),"undefined"==typeof window){if(h)return;const e=function(t,e){return gt([t],e)}(t,r.pathname);e&&(d.set(e),h=!0)}else $.update((e=>(e.push(t),e)))},unregisterRoute:function(t){$.update((e=>{const n=e.indexOf(t);return e.splice(n,1),e}))}}),t.$$set=t=>{"basepath"in t&&n(3,u=t.basepath),"url"in t&&n(4,a=t.url),"$$scope"in t&&n(8,i=t.$$scope)},t.$$.update=()=>{if(128&t.$$.dirty){const{path:t}=s;$.update((e=>(e.forEach((e=>e.path=vt(t,e._path))),e)))}if(96&t.$$.dirty){const t=gt(o,r.pathname);d.set(t)}},[$,m,g,u,a,r,o,s,i,c]}class wt extends nt{constructor(t){super(),et(this,t,xt,yt,c,{basepath:3,url:4})}}const kt=t=>({params:4&t,location:16&t}),_t=t=>({params:t[2],location:t[4]});function Et(t){let e,n,r,o;const s=[zt,jt],c=[];function i(t,e){return null!==t[0]?0:1}return e=i(t),n=c[e]=s[e](t),{c(){n.c(),r=_()},m(t,n){c[e].m(t,n),v(t,r,n),o=!0},p(t,o){let u=e;e=i(t),e===u?c[e].p(t,o):(V(),W(c[u],1,1,(()=>{c[u]=null})),F(),n=c[e],n?n.p(t,o):(n=c[e]=s[e](t),n.c()),I(n,1),n.m(r.parentNode,r))},i(t){o||(I(n),o=!0)},o(t){W(n),o=!1},d(t){c[e].d(t),t&&y(r)}}}function jt(t){let e;const n=t[10].default,r=f(n,t,t[9],_t);return{c(){r&&r.c()},m(t,n){r&&r.m(t,n),e=!0},p(t,o){r&&r.p&&(!e||532&o)&&d(r,n,t,t[9],e?$(n,t[9],o,kt):h(t[9]),_t)},i(t){e||(I(r,t),e=!0)},o(t){W(r,t),e=!1},d(t){r&&r.d(t)}}}function zt(t){let n,r,o;const s=[{location:t[4]},t[2],t[3]];var c=t[0];function i(t){let n={};for(let t=0;t<s.length;t+=1)n=e(n,s[t]);return{props:n}}return c&&(n=new c(i())),{c(){n&&Q(n.$$.fragment),r=_()},m(t,e){n&&X(n,t,e),v(t,r,e),o=!0},p(t,e){const o=28&e?Y(s,[16&e&&{location:t[4]},4&e&&J(t[2]),8&e&&J(t[3])]):{};if(c!==(c=t[0])){if(n){V();const t=n;W(t.$$.fragment,1,0,(()=>{Z(t,1)})),F()}c?(n=new c(i()),Q(n.$$.fragment),I(n.$$.fragment,1),X(n,r.parentNode,r)):n=null}else c&&n.$set(o)},i(t){o||(n&&I(n.$$.fragment,t),o=!0)},o(t){n&&W(n.$$.fragment,t),o=!1},d(t){t&&y(r),n&&Z(n,t)}}}function Lt(t){let e,n,r=null!==t[1]&&t[1].route===t[7]&&Et(t);return{c(){r&&r.c(),e=_()},m(t,o){r&&r.m(t,o),v(t,e,o),n=!0},p(t,[n]){null!==t[1]&&t[1].route===t[7]?r?(r.p(t,n),2&n&&I(r,1)):(r=Et(t),r.c(),I(r,1),r.m(e.parentNode,e)):r&&(V(),W(r,1,1,(()=>{r=null})),F())},i(t){n||(I(r),n=!0)},o(t){W(r),n=!1},d(t){r&&r.d(t),t&&y(e)}}}function St(t,n,r){let o,s,{$$slots:c={},$$scope:i}=n,{path:u=""}=n,{component:a=null}=n;const{registerRoute:f,unregisterRoute:p,activeRoute:$}=P(it);l(t,$,(t=>r(1,o=t)));const d=P(ct);l(t,d,(t=>r(4,s=t)));const h={path:u,default:""===u};let g={},b={};var v;return f(h),"undefined"!=typeof window&&(v=()=>{p(h)},L().$$.on_destroy.push(v)),t.$$set=t=>{r(13,n=e(e({},n),m(t))),"path"in t&&r(8,u=t.path),"component"in t&&r(0,a=t.component),"$$scope"in t&&r(9,i=t.$$scope)},t.$$.update=()=>{2&t.$$.dirty&&o&&o.route===h&&r(2,g=o.params);{const{path:t,component:e,...o}=n;r(3,b=o)}},n=m(n),[a,o,g,b,s,$,d,h,u,i,c]}class Ct extends nt{constructor(t){super(),et(this,t,St,Lt,c,{path:8,component:0})}}function Pt(t){let n,r,o,s;const c=t[16].default,i=f(c,t,t[15],null);let u=[{href:t[0]},{"aria-current":t[2]},t[1],t[6]],a={};for(let t=0;t<u.length;t+=1)a=e(a,u[t]);return{c(){n=x("a"),i&&i.c(),j(n,a)},m(e,c){var u,a,l,f;v(e,n,c),i&&i.m(n,null),r=!0,o||(u=n,a="click",l=t[5],u.addEventListener(a,l,f),s=()=>u.removeEventListener(a,l,f),o=!0)},p(t,[e]){i&&i.p&&(!r||32768&e)&&d(i,c,t,t[15],r?$(c,t[15],e,null):h(t[15]),null),j(n,a=Y(u,[(!r||1&e)&&{href:t[0]},(!r||4&e)&&{"aria-current":t[2]},2&e&&t[1],64&e&&t[6]]))},i(t){r||(I(i,t),r=!0)},o(t){W(i,t),r=!1},d(t){t&&y(n),i&&i.d(t),o=!1,s()}}}function Bt(t,n,r){let o;const s=["to","replace","state","getProps"];let c,i,u=g(n,s),{$$slots:a={},$$scope:f}=n,{to:p="#"}=n,{replace:$=!1}=n,{state:d={}}=n,{getProps:h=(()=>({}))}=n;const{base:b}=P(it);l(t,b,(t=>r(14,i=t)));const v=P(ct);l(t,v,(t=>r(13,c=t)));const y=S();let x,w,k,_;return t.$$set=t=>{n=e(e({},n),m(t)),r(6,u=g(n,s)),"to"in t&&r(7,p=t.to),"replace"in t&&r(8,$=t.replace),"state"in t&&r(9,d=t.state),"getProps"in t&&r(10,h=t.getProps),"$$scope"in t&&r(15,f=t.$$scope)},t.$$.update=()=>{16512&t.$$.dirty&&r(0,x="/"===p?i.uri:function(t,e){if(pt(t,"/"))return t;const[n,r]=t.split("?"),[o]=e.split("?"),s=dt(n),c=dt(o);if(""===s[0])return bt(o,r);if(!pt(s[0],"."))return bt(("/"===o?"":"/")+c.concat(s).join("/"),r);const i=c.concat(s),u=[];return i.forEach((t=>{".."===t?u.pop():"."!==t&&u.push(t)})),bt("/"+u.join("/"),r)}(p,i.uri)),8193&t.$$.dirty&&r(11,w=pt(c.pathname,x)),8193&t.$$.dirty&&r(12,k=x===c.pathname),4096&t.$$.dirty&&r(2,o=k?"page":void 0),15361&t.$$.dirty&&r(1,_=h({location:c,href:x,isPartiallyCurrent:w,isCurrent:k}))},[x,_,o,b,v,function(t){if(y("click",t),function(t){return!t.defaultPrevented&&0===t.button&&!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}(t)){t.preventDefault();const e=c.pathname===x||$;lt(x,{state:d,replace:e})}},u,p,$,d,h,w,k,c,i,f,a]}class Rt extends nt{constructor(t){super(),et(this,t,Bt,Pt,c,{to:7,replace:8,state:9,getProps:10})}}function Mt(e){let n;return{c(){n=x("div"),n.textContent="Start",E(n,"class","svelte-1888o83")},m(t,e){v(t,n,e)},p:t,d(t){t&&y(n)}}}function Ot(e){let n;return{c(){n=x("div"),n.textContent="Texte",E(n,"class","svelte-1888o83")},m(t,e){v(t,n,e)},p:t,d(t){t&&y(n)}}}function qt(e){let n;return{c(){n=x("div"),n.textContent="Kontakt",E(n,"class","svelte-1888o83")},m(t,e){v(t,n,e)},p:t,d(t){t&&y(n)}}}function At(t){let e,n,r,o,s,c,i,u,a,l;return s=new Rt({props:{to:"/",$$slots:{default:[Mt]},$$scope:{ctx:t}}}),i=new Rt({props:{to:"texte",$$slots:{default:[Ot]},$$scope:{ctx:t}}}),a=new Rt({props:{to:"kontakt",$$slots:{default:[qt]},$$scope:{ctx:t}}}),{c(){e=x("header"),n=x("nav"),r=x("a"),r.innerHTML='<div class="svelte-1888o83"></div>',o=k(),Q(s.$$.fragment),c=k(),Q(i.$$.fragment),u=k(),Q(a.$$.fragment),E(r,"href","https://www.startpage.com/do/dsearch?query=Lutz+V%C3%B6ssing"),E(r,"id","nav__lutz"),E(r,"target","_blank"),E(r,"class","svelte-1888o83"),E(n,"class","svelte-1888o83"),E(e,"class","svelte-1888o83")},m(t,f){v(t,e,f),b(e,n),b(n,r),b(n,o),X(s,n,null),b(n,c),X(i,n,null),b(n,u),X(a,n,null),l=!0},p(t,[e]){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n);const r={};1&e&&(r.$$scope={dirty:e,ctx:t}),i.$set(r);const o={};1&e&&(o.$$scope={dirty:e,ctx:t}),a.$set(o)},i(t){l||(I(s.$$.fragment,t),I(i.$$.fragment,t),I(a.$$.fragment,t),l=!0)},o(t){W(s.$$.fragment,t),W(i.$$.fragment,t),W(a.$$.fragment,t),l=!1},d(t){t&&y(e),Z(s),Z(i),Z(a)}}}class Kt extends nt{constructor(t){super(),et(this,t,null,At,c,{})}}function Tt(e){let n,r,o;return{c(){n=x("div"),n.textContent="Geboren 1990 in Höxter, Kurzaufenthalt in Mittelsachsen, Studium der\r\n  Philosophie und Literaturwissenschaft in Wien und Berlin, lebt und arbeitet in\r\n  Berlin.",r=k(),o=x("div"),o.textContent="Beiträge für skug, GROOVE, Spex, wina, Ventil-Verlag, Facebook, Radio und\r\n  diverse Arbeiten als Ghostwriter im Bereich Musik und Kultur",E(n,"class","bio"),E(o,"class","bio")},m(t,e){v(t,n,e),v(t,r,e),v(t,o,e)},p:t,i:t,o:t,d(t){t&&y(n),t&&y(r),t&&y(o)}}}class Nt extends nt{constructor(t){super(),et(this,t,null,Tt,c,{})}}function Dt(e){let n,r,o,s;return{c(){var t,e;n=x("img"),o=k(),s=x("div"),s.textContent="mailto:lutz@gott.info",t=n.src,e=r="/lutz-foto.jpg",i||(i=document.createElement("a")),i.href=e,t!==i.href&&E(n,"src","/lutz-foto.jpg"),E(n,"alt","Lutz lesend"),E(n,"class","svelte-1jzeaqs")},m(t,e){v(t,n,e),v(t,o,e),v(t,s,e)},p:t,i:t,o:t,d(t){t&&y(n),t&&y(o),t&&y(s)}}}class Gt extends nt{constructor(t){super(),et(this,t,null,Dt,c,{})}}function Ht(e){let n,r,o;return{c(){n=x("h2"),n.innerHTML='<span class="svelte-tbq4dj">Texte (Auswahl)</span>',r=k(),o=x("ul"),o.innerHTML='<li class="svelte-tbq4dj"><a href="https://www.wina-magazin.at/die-ueblichen-bilder-brechen/" target="_blank">Die üblichen Bilder brechen (in: Wina - Das jüdische Stadtmagazin)</a></li> \n  <li class="svelte-tbq4dj"><a href="https://skug.at/braune-grauzone/" target="_blank">Braune Grauzone (in: skug | MUSIKKULTUR)</a></li> \n  <li class="svelte-tbq4dj"><a href="https://groove.de/2021/06/18/flying-lotus-yasuke-nichts-entsteht-ohne-opfer-schmerz-und-blut/" target="_blank">Flying Lotus&#39; „Yasuke”: „Nichts entsteht ohne Opfer, Schmerz und Blut.”\n      (in: Groove)</a></li> \n  <li class="svelte-tbq4dj"><a href="https://www.ventil-verlag.de/titel/1850/these-girls/" target="_blank">„Anne Rolfs” &amp; „Karen Dalton” (in: These Girls - Ein Streifzug durch die\n      feministische Musikgeschichte)</a></li>',E(n,"class","svelte-tbq4dj"),E(o,"class","svelte-tbq4dj")},m(t,e){v(t,n,e),v(t,r,e),v(t,o,e)},p:t,i:t,o:t,d(t){t&&y(n),t&&y(r),t&&y(o)}}}class Ut extends nt{constructor(t){super(),et(this,t,null,Ht,c,{})}}function Vt(e){let n,r,o;return r=new Nt({}),{c(){n=x("div"),Q(r.$$.fragment),E(n,"class","contentbox svelte-14t1s5p")},m(t,e){v(t,n,e),X(r,n,null),o=!0},p:t,i(t){o||(I(r.$$.fragment,t),o=!0)},o(t){W(r.$$.fragment,t),o=!1},d(t){t&&y(n),Z(r)}}}function Ft(e){let n,r,o;return r=new Gt({}),{c(){n=x("div"),Q(r.$$.fragment),E(n,"class","contentbox svelte-14t1s5p")},m(t,e){v(t,n,e),X(r,n,null),o=!0},p:t,i(t){o||(I(r.$$.fragment,t),o=!0)},o(t){W(r.$$.fragment,t),o=!1},d(t){t&&y(n),Z(r)}}}function It(e){let n,r,o;return r=new Ut({}),{c(){n=x("div"),Q(r.$$.fragment),E(n,"class","contentbox svelte-14t1s5p")},m(t,e){v(t,n,e),X(r,n,null),o=!0},p:t,i(t){o||(I(r.$$.fragment,t),o=!0)},o(t){W(r.$$.fragment,t),o=!1},d(t){t&&y(n),Z(r)}}}function Wt(t){let e,n,r,o,s,c,i,u,a,l,f,p,$;return e=new Kt({}),u=new Ct({props:{path:"/",$$slots:{default:[Vt]},$$scope:{ctx:t}}}),l=new Ct({props:{path:"kontakt",$$slots:{default:[Ft]},$$scope:{ctx:t}}}),p=new Ct({props:{path:"texte",$$slots:{default:[It]},$$scope:{ctx:t}}}),{c(){Q(e.$$.fragment),n=k(),r=x("main"),o=x("div"),s=k(),c=x("h1"),c.innerHTML='<span class="svelte-14t1s5p">Lutz Vössing</span>',i=k(),Q(u.$$.fragment),a=k(),Q(l.$$.fragment),f=k(),Q(p.$$.fragment),E(o,"id","checkgrid"),E(o,"class","svelte-14t1s5p"),E(c,"class","svelte-14t1s5p"),E(r,"class","svelte-14t1s5p")},m(t,d){X(e,t,d),v(t,n,d),v(t,r,d),b(r,o),b(r,s),b(r,c),b(r,i),X(u,r,null),b(r,a),X(l,r,null),b(r,f),X(p,r,null),$=!0},p(t,e){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),u.$set(n);const r={};1&e&&(r.$$scope={dirty:e,ctx:t}),l.$set(r);const o={};1&e&&(o.$$scope={dirty:e,ctx:t}),p.$set(o)},i(t){$||(I(e.$$.fragment,t),I(u.$$.fragment,t),I(l.$$.fragment,t),I(p.$$.fragment,t),$=!0)},o(t){W(e.$$.fragment,t),W(u.$$.fragment,t),W(l.$$.fragment,t),W(p.$$.fragment,t),$=!1},d(t){Z(e,t),t&&y(n),t&&y(r),Z(u),Z(l),Z(p)}}}function Yt(t){let e,n;return e=new wt({props:{$$slots:{default:[Wt]},$$scope:{ctx:t}}}),{c(){Q(e.$$.fragment)},m(t,r){X(e,t,r),n=!0},p(t,[n]){const r={};1&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(I(e.$$.fragment,t),n=!0)},o(t){W(e.$$.fragment,t),n=!1},d(t){Z(e,t)}}}return new class extends nt{constructor(t){super(),et(this,t,null,Yt,c,{})}}({target:document.body,props:{name:"world"}})}();
>>>>>>> a21ad852ac15509c0ee3696bdd0eedf8e4f6854b
//# sourceMappingURL=bundle.js.map
