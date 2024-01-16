
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc) {
        const info = { style_element: element('style'), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { style_element, rules } = managed_styles.get(doc) || create_style_information(doc);
        if (!rules[name]) {
            const stylesheet = append_stylesheet(doc, style_element);
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { style_element } = info;
                detach(style_element);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\pages\Texte.svelte generated by Svelte v3.50.0 */
    const file$5 = "src\\pages\\Texte.svelte";

    function create_fragment$5(ctx) {
    	let div;
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
    	let t9;
    	let li4;
    	let a4;
    	let t11;
    	let li5;
    	let a5;
    	let t13;
    	let li6;
    	let a6;
    	let t15;
    	let li7;
    	let a7;
    	let t17;
    	let li8;
    	let a8;
    	let t19;
    	let li9;
    	let a9;
    	let t21;
    	let li10;
    	let a10;
    	let t23;
    	let li11;
    	let a11;
    	let t25;
    	let li12;
    	let a12;
    	let t27;
    	let li13;
    	let a13;
    	let t29;
    	let li14;
    	let a14;
    	let t31;
    	let li15;
    	let a15;
    	let t33;
    	let li16;
    	let a16;
    	let t35;
    	let li17;
    	let a17;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
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
    			a2.textContent = "Flying Lotus' „Yasuke”: „Nichts entsteht ohne Opfer, Schmerz und Blut.”\r\n        (in: Groove)";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "„Anne Rolfs” & „Karen Dalton” (in: These Girls - Ein Streifzug durch\r\n        die feministische Musikgeschichte)";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Beitrag in Celan Perspektiven 2020";
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Beitrag 15. RischArt_Projekt - JAJA – NEINNEIN – VIELLEICHT (Sophia\r\n        Süßmilch, „Denkmal der Beleidigung”)";
    			t13 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Interview mit Jan Müller (Tocotronic)";
    			t15 = space();
    			li7 = element("li");
    			a7 = element("a");
    			a7.textContent = "Interview mit Nichtseattle";
    			t17 = space();
    			li8 = element("li");
    			a8 = element("a");
    			a8.textContent = "Filmrezension „Aşk, Mark ve Ölüm”";
    			t19 = space();
    			li9 = element("li");
    			a9 = element("a");
    			a9.textContent = "Buchrezension von Salmen Gradowskis „Die Zertrennung”";
    			t21 = space();
    			li10 = element("li");
    			a10 = element("a");
    			a10.textContent = "Rezension „Monsieur Pain” von Roberto Bolaño";
    			t23 = space();
    			li11 = element("li");
    			a11 = element("a");
    			a11.textContent = "Filmrezension „Olanda” von Bernd Schoch";
    			t25 = space();
    			li12 = element("li");
    			a12 = element("a");
    			a12.textContent = "Interview mit Boaz Goldberg zu Charlie Megira";
    			t27 = space();
    			li13 = element("li");
    			a13 = element("a");
    			a13.textContent = "„Von Sehnsucht und Leistungssport” – Über Tobias Rüthers\r\n        Wolfgang-Herrndorf-Biographie";
    			t29 = space();
    			li14 = element("li");
    			a14 = element("a");
    			a14.textContent = "»Berichte aus einer Schattenwelt« – Interview mit Frédéric Valin";
    			t31 = space();
    			li15 = element("li");
    			a15 = element("a");
    			a15.textContent = "Vom »Altneuland« ins Niemandsland – Über Tomer Dotan-Dreyfus'\r\n        »Birobidschan« und Michael Chabons »Die Vereinigung jiddischer\r\n        Polizisten«";
    			t33 = space();
    			li16 = element("li");
    			a16 = element("a");
    			a16.textContent = "Translations of forgotten dreams – Interview mit Lauri Ainala\r\n        (Paavoharju)";
    			t35 = space();
    			li17 = element("li");
    			a17 = element("a");
    			a17.textContent = "Nachruf auf Peter Brötzmann";
    			add_location(span, file$5, 5, 6, 128);
    			add_location(h2, file$5, 5, 2, 124);
    			attr_dev(a0, "href", "https://www.wina-magazin.at/die-ueblichen-bilder-brechen/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			add_location(a0, file$5, 8, 6, 187);
    			attr_dev(li0, "class", "svelte-10s391v");
    			add_location(li0, file$5, 7, 4, 175);
    			attr_dev(a1, "href", "https://skug.at/braune-grauzone/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			add_location(a1, file$5, 16, 6, 441);
    			attr_dev(li1, "class", "svelte-10s391v");
    			add_location(li1, file$5, 15, 4, 429);
    			attr_dev(a2, "href", "https://groove.de/2021/06/18/flying-lotus-yasuke-nichts-entsteht-ohne-opfer-schmerz-und-blut/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener noreferrer");
    			add_location(a2, file$5, 23, 6, 634);
    			attr_dev(li2, "class", "svelte-10s391v");
    			add_location(li2, file$5, 22, 4, 622);
    			attr_dev(a3, "href", "https://www.ventil-verlag.de/titel/1850/these-girls/");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener noreferrer");
    			add_location(a3, file$5, 32, 6, 951);
    			attr_dev(li3, "class", "svelte-10s391v");
    			add_location(li3, file$5, 31, 4, 939);
    			attr_dev(a4, "href", "https://www.winter-verlag.de/de/detail/978-3-8253-4772-7/Celan_Perspektiven_2020/");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener noreferrer");
    			add_location(a4, file$5, 41, 6, 1246);
    			attr_dev(li4, "class", "svelte-10s391v");
    			add_location(li4, file$5, 40, 4, 1234);
    			attr_dev(a5, "href", "https://artistbooks.de/suchen/einzeltitel.php?mediaid=28510");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noopener noreferrer");
    			add_location(a5, file$5, 48, 6, 1482);
    			attr_dev(li5, "class", "svelte-10s391v");
    			add_location(li5, file$5, 47, 4, 1470);
    			attr_dev(a6, "href", "https://skug.at/nostalgie-ist-uns-fremd/");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noopener noreferrer");
    			add_location(a6, file$5, 57, 6, 1785);
    			attr_dev(li6, "class", "svelte-10s391v");
    			add_location(li6, file$5, 56, 4, 1773);
    			attr_dev(a7, "href", "https://skug.at/zwischen-glueck-und-schwermut/");
    			attr_dev(a7, "target", "_blank");
    			attr_dev(a7, "rel", "noopener noreferrer");
    			add_location(a7, file$5, 64, 6, 1983);
    			attr_dev(li7, "class", "svelte-10s391v");
    			add_location(li7, file$5, 63, 4, 1971);
    			attr_dev(a8, "href", "https://skug.at/ask-mark-ve-oeluem-cem-kaya-film-berlinale/");
    			attr_dev(a8, "target", "_blank");
    			attr_dev(a8, "rel", "noopener noreferrer");
    			add_location(a8, file$5, 71, 6, 2176);
    			attr_dev(li8, "class", "svelte-10s391v");
    			add_location(li8, file$5, 70, 4, 2164);
    			attr_dev(a9, "href", "https://skug.at/schreiben-im-angesicht-des-todes/");
    			attr_dev(a9, "target", "_blank");
    			attr_dev(a9, "rel", "noopener noreferrer");
    			add_location(a9, file$5, 78, 6, 2389);
    			attr_dev(li9, "class", "svelte-10s391v");
    			add_location(li9, file$5, 77, 4, 2377);
    			attr_dev(a10, "href", "https://skug.at/verfolgungswahn-in-romanform/");
    			attr_dev(a10, "target", "_blank");
    			attr_dev(a10, "rel", "noopener noreferrer");
    			add_location(a10, file$5, 86, 6, 2622);
    			attr_dev(li10, "class", "svelte-10s391v");
    			add_location(li10, file$5, 85, 4, 2610);
    			attr_dev(a11, "href", "https://skug.at/ein-pilz-ist-ein-pilz-ist-ein-pilz/");
    			attr_dev(a11, "target", "_blank");
    			attr_dev(a11, "rel", "noopener noreferrer");
    			add_location(a11, file$5, 94, 6, 2842);
    			attr_dev(li11, "class", "svelte-10s391v");
    			add_location(li11, file$5, 93, 4, 2830);
    			attr_dev(a12, "href", "https://skug.at/smile-now-cry-later-the-story-of-charlie-megira/");
    			attr_dev(a12, "target", "_blank");
    			attr_dev(a12, "rel", "noopener noreferrer");
    			add_location(a12, file$5, 101, 6, 3053);
    			attr_dev(li12, "class", "svelte-10s391v");
    			add_location(li12, file$5, 100, 4, 3041);
    			attr_dev(a13, "href", "https://skug.at/von-sehnsucht-und-leistungssport/");
    			attr_dev(a13, "target", "_blank");
    			attr_dev(a13, "rel", "noopener noreferrer");
    			add_location(a13, file$5, 109, 6, 3293);
    			attr_dev(li13, "class", "svelte-10s391v");
    			add_location(li13, file$5, 108, 4, 3281);
    			attr_dev(a14, "href", "https://skug.at/berichte-aus-einer-schattenwelt/");
    			attr_dev(a14, "target", "_blank");
    			attr_dev(a14, "rel", "noopener noreferrer");
    			add_location(a14, file$5, 118, 6, 3568);
    			attr_dev(li14, "class", "svelte-10s391v");
    			add_location(li14, file$5, 117, 4, 3556);
    			attr_dev(a15, "href", "https://skug.at/vom-altneuland-ins-niemandsland/");
    			attr_dev(a15, "target", "_blank");
    			attr_dev(a15, "rel", "noopener noreferrer");
    			add_location(a15, file$5, 128, 6, 3821);
    			attr_dev(li15, "class", "svelte-10s391v");
    			add_location(li15, file$5, 127, 4, 3809);
    			attr_dev(a16, "href", "https://skug.at/translations-of-forgotten-dreams/");
    			attr_dev(a16, "target", "_blank");
    			attr_dev(a16, "rel", "noopener noreferrer");
    			add_location(a16, file$5, 139, 6, 4162);
    			attr_dev(li16, "class", "svelte-10s391v");
    			add_location(li16, file$5, 138, 4, 4150);
    			attr_dev(a17, "href", "https://skug.at/peter-broetzmann-%e2%80%a0");
    			attr_dev(a17, "target", "_blank");
    			attr_dev(a17, "rel", "noopener noreferrer");
    			add_location(a17, file$5, 150, 6, 4435);
    			attr_dev(li17, "class", "svelte-10s391v");
    			add_location(li17, file$5, 149, 4, 4423);
    			attr_dev(ul, "class", "svelte-10s391v");
    			add_location(ul, file$5, 6, 2, 165);
    			attr_dev(div, "class", "contentbox");
    			add_location(div, file$5, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, span);
    			append_dev(div, t1);
    			append_dev(div, ul);
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
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t11);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(ul, t13);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			append_dev(ul, t15);
    			append_dev(ul, li7);
    			append_dev(li7, a7);
    			append_dev(ul, t17);
    			append_dev(ul, li8);
    			append_dev(li8, a8);
    			append_dev(ul, t19);
    			append_dev(ul, li9);
    			append_dev(li9, a9);
    			append_dev(ul, t21);
    			append_dev(ul, li10);
    			append_dev(li10, a10);
    			append_dev(ul, t23);
    			append_dev(ul, li11);
    			append_dev(li11, a11);
    			append_dev(ul, t25);
    			append_dev(ul, li12);
    			append_dev(li12, a12);
    			append_dev(ul, t27);
    			append_dev(ul, li13);
    			append_dev(li13, a13);
    			append_dev(ul, t29);
    			append_dev(ul, li14);
    			append_dev(li14, a14);
    			append_dev(ul, t31);
    			append_dev(ul, li15);
    			append_dev(li15, a15);
    			append_dev(ul, t33);
    			append_dev(ul, li16);
    			append_dev(li16, a16);
    			append_dev(ul, t35);
    			append_dev(ul, li17);
    			append_dev(li17, a17);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 500 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Texte', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Texte> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade });
    	return [];
    }

    class Texte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Texte",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\Kontakt.svelte generated by Svelte v3.50.0 */
    const file$4 = "src\\pages\\Kontakt.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let h2;
    	let span;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let a;
    	let t4;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			span = element("span");
    			span.textContent = "Kontakt";
    			t1 = space();
    			img = element("img");
    			t2 = text("\r\n  Schreibt mir gerne via ");
    			a = element("a");
    			a.textContent = "E-Mail";
    			t4 = text(", ich drucke die Nachrichten dann aus und lese sie.");
    			add_location(span, file$4, 5, 6, 132);
    			attr_dev(h2, "class", "svelte-uzk144");
    			add_location(h2, file$4, 5, 2, 128);
    			if (!src_url_equal(img.src, img_src_value = "/lutz-logo.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Lutz written with an eel");
    			attr_dev(img, "class", "svelte-uzk144");
    			add_location(img, file$4, 7, 2, 220);
    			attr_dev(a, "href", "mailto:luzz@tuta.io");
    			attr_dev(a, "class", "svelte-uzk144");
    			add_location(a, file$4, 8, 25, 306);
    			attr_dev(div, "class", "contentbox");
    			add_location(div, file$4, 4, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, span);
    			append_dev(div, t1);
    			append_dev(div, img);
    			append_dev(div, t2);
    			append_dev(div, a);
    			append_dev(div, t4);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 500 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	validate_slots('Kontakt', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Kontakt> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade });
    	return [];
    }

    class Kontakt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Kontakt",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Hero.svelte generated by Svelte v3.50.0 */
    const file$3 = "src\\components\\Hero.svelte";

    function create_fragment$3(ctx) {
    	let h1;
    	let span;
    	let h1_intro;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Lutz Vössing";
    			attr_dev(span, "class", "svelte-13khxct");
    			add_location(span, file$3, 5, 4, 108);
    			attr_dev(h1, "class", "svelte-13khxct");
    			add_location(h1, file$3, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!h1_intro) {
    				add_render_callback(() => {
    					h1_intro = create_in_transition(h1, fade, { duration: 500 });
    					h1_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade });
    	return [];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Bio.svelte generated by Svelte v3.50.0 */
    const file$2 = "src\\pages\\Bio.svelte";

    function create_fragment$2(ctx) {
    	let hero;
    	let t0;
    	let div2;
    	let h2;
    	let span;
    	let t2;
    	let div0;
    	let t4;
    	let div1;
    	let div2_intro;
    	let current;
    	hero = new Hero({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(hero.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			h2 = element("h2");
    			span = element("span");
    			span.textContent = "Bio";
    			t2 = space();
    			div0 = element("div");
    			div0.textContent = "Geboren 1990 in Höxter, Kurzaufenthalt in Mittelsachsen, Studium der\r\n    Philosophie und Literaturwissenschaft in Wien und Berlin, lebt und arbeitet\r\n    in Berlin.";
    			t4 = space();
    			div1 = element("div");
    			div1.textContent = "Beiträge für skug, GROOVE, Spex, wina, Ventil-Verlag, Facebook, Radio und\r\n    diverse Arbeiten als Ghostwriter im Bereich Musik und Kultur";
    			add_location(span, file$2, 8, 6, 193);
    			add_location(h2, file$2, 8, 2, 189);
    			attr_dev(div0, "class", "bio svelte-1fspj1p");
    			add_location(div0, file$2, 9, 2, 218);
    			attr_dev(div1, "class", "bio svelte-1fspj1p");
    			add_location(div1, file$2, 14, 2, 420);
    			attr_dev(div2, "class", "contentbox");
    			add_location(div2, file$2, 7, 2, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(hero, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h2);
    			append_dev(h2, span);
    			append_dev(div2, t2);
    			append_dev(div2, div0);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hero.$$.fragment, local);

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, fade, { duration: 500 });
    					div2_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hero, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bio', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bio> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Hero, fade });
    	return [];
    }

    class Bio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bio",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Landing.svelte generated by Svelte v3.50.0 */

    const file$1 = "src\\pages\\Landing.svelte";

    function create_fragment$1(ctx) {
    	let a;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/lutz-jap__alt.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Eel with Lutz written beside it");
    			attr_dev(img, "class", "svelte-v1d34z");
    			add_location(img, file$1, 7, 26, 146);
    			attr_dev(a, "href", "https://www.google.de/search?q=Lutz+V%C3%B6ssing");
    			attr_dev(a, "id", "landing_lutz");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-v1d34z");
    			add_location(a, file$1, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
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
    	validate_slots('Landing', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\components\Nav.svelte generated by Svelte v3.50.0 */

    const navOptions = {
    	"landing": Landing,
    	"bio": Bio,
    	"kontakt": Kontakt,
    	"texte": Texte
    };

    /* src\App.svelte generated by Svelte v3.50.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let nav;
    	let div0;
    	let div0_style_value;
    	let t0;
    	let div1;
    	let t1;
    	let div1_class_value;
    	let t2;
    	let div2;
    	let t3;
    	let div2_class_value;
    	let t4;
    	let div3;
    	let t5;
    	let div3_class_value;
    	let nav_class_value;
    	let t6;
    	let main;
    	let div4;
    	let t7;
    	let switch_instance;
    	let main_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = navOptions[/*pgSelected*/ ctx[0]];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav = element("nav");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text("Bio");
    			t2 = space();
    			div2 = element("div");
    			t3 = text("Texte");
    			t4 = space();
    			div3 = element("div");
    			t5 = text("Kontakt");
    			t6 = space();
    			main = element("main");
    			div4 = element("div");
    			t7 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "style", div0_style_value = /*pgSelected*/ ctx[0] == "landing" ? "display:none" : "");
    			attr_dev(div0, "id", "landing");
    			attr_dev(div0, "class", "svelte-1fn5m72");
    			add_location(div0, file, 13, 4, 341);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "bio" ? "active" : "inactive") + " svelte-1fn5m72"));
    			attr_dev(div1, "id", "bio");
    			add_location(div1, file, 18, 4, 474);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "texte" ? "active" : "inactive") + " svelte-1fn5m72"));
    			attr_dev(div2, "id", "texte");
    			add_location(div2, file, 26, 4, 625);

    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "kontakt"
    			? "active"
    			: "inactive") + " svelte-1fn5m72"));

    			attr_dev(div3, "id", "kontakt");
    			add_location(div3, file, 34, 4, 782);
    			attr_dev(nav, "class", nav_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "landing" ? "landing" : "") + " svelte-1fn5m72"));
    			add_location(nav, file, 12, 2, 281);
    			attr_dev(header, "class", "svelte-1fn5m72");
    			add_location(header, file, 11, 0, 269);
    			attr_dev(div4, "id", "checkgrid");
    			attr_dev(div4, "class", "svelte-1fn5m72");
    			add_location(div4, file, 45, 2, 1021);
    			attr_dev(main, "class", main_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "landing" ? "landing" : "") + " svelte-1fn5m72"));
    			add_location(main, file, 44, 0, 962);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, div0);
    			append_dev(nav, t0);
    			append_dev(nav, div1);
    			append_dev(div1, t1);
    			append_dev(nav, t2);
    			append_dev(nav, div2);
    			append_dev(div2, t3);
    			append_dev(nav, t4);
    			append_dev(nav, div3);
    			append_dev(div3, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(main, t7);

    			if (switch_instance) {
    				mount_component(switch_instance, main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*changeComponent*/ ctx[1], false, false, false),
    					listen_dev(div1, "click", /*changeComponent*/ ctx[1], false, false, false),
    					listen_dev(div2, "click", /*changeComponent*/ ctx[1], false, false, false),
    					listen_dev(div3, "click", /*changeComponent*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*pgSelected*/ 1 && div0_style_value !== (div0_style_value = /*pgSelected*/ ctx[0] == "landing" ? "display:none" : "")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (!current || dirty & /*pgSelected*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "bio" ? "active" : "inactive") + " svelte-1fn5m72"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*pgSelected*/ 1 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "texte" ? "active" : "inactive") + " svelte-1fn5m72"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty & /*pgSelected*/ 1 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "kontakt"
    			? "active"
    			: "inactive") + " svelte-1fn5m72"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty & /*pgSelected*/ 1 && nav_class_value !== (nav_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "landing" ? "landing" : "") + " svelte-1fn5m72"))) {
    				attr_dev(nav, "class", nav_class_value);
    			}

    			if (switch_value !== (switch_value = navOptions[/*pgSelected*/ ctx[0]])) {
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
    					mount_component(switch_instance, main, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty & /*pgSelected*/ 1 && main_class_value !== (main_class_value = "" + (null_to_empty(/*pgSelected*/ ctx[0] == "landing" ? "landing" : "") + " svelte-1fn5m72"))) {
    				attr_dev(main, "class", main_class_value);
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
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(main);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			run_all(dispose);
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
    	let pgSelected = "landing";

    	function changeComponent(event) {
    		$$invalidate(0, pgSelected = event.srcElement.id);
    		console.log(pgSelected);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		navOptions,
    		fade,
    		pgSelected,
    		changeComponent
    	});

    	$$self.$inject_state = $$props => {
    		if ('pgSelected' in $$props) $$invalidate(0, pgSelected = $$props.pgSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pgSelected, changeComponent];
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
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
