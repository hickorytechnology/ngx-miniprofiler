// export class MiniProfiler {
//   public init = (): MiniProfiler => {
//     const mp = this;
//     const script = document.getElementById('mini-profiler');
//     const data = script.dataset;
//     let wait = 0;
//     let alreadyDone = false;

//     if (!script || !window.fetch) {
//       return;
//     }

//     const bool = (arg: string) => arg === 'true';

//     this.options = {
//       ids: (data.ids || '').split(','),
//       path: data.path,
//       version: data.version,
//       renderPosition: data.position as RenderPosition,
//       colorScheme: data.scheme as ColorScheme,
//       showTrivial: bool(data.trivial),
//       trivialMilliseconds: parseFloat(data.trivialMilliseconds),
//       showChildrenTime: bool(data.children),
//       maxTracesToShow: parseInt(data.maxTraces, 10),
//       showControls: bool(data.controls),
//       currentId: data.currentId,
//       authorized: bool(data.authorized),
//       toggleShortcut: data.toggleShortcut,
//       startHidden: bool(data.startHidden),
//       ignoredDuplicateExecuteTypes: (data.ignoredDuplicateExecuteTypes || '').split(','),
//     };

//     function doInit() {
//       const initPopupView = () => {
//         if (mp.options.authorized) {
//           // all fetched profilers will go in here
//           // MiniProfiler.RenderIncludes() sets which corner to render in - default is upper left
//           const container = document.createElement('div');
//           container.className =
//             'mp-results mp-' +
//             mp.options.renderPosition.toLowerCase() +
//             ' mp-scheme-' +
//             mp.options.colorScheme.toLowerCase();
//           document.body.appendChild(container);
//           mp.container = container;

//           // initialize the controls
//           mp.initControls(mp.container);

//           // fetch and render results
//           mp.fetchResults(mp.options.ids);

//           let lsDisplayValue;
//           try {
//             lsDisplayValue = window.localStorage.getItem('MiniProfiler-Display');
//           } catch (e) {}

//           if (lsDisplayValue) {
//             mp.container.style.display = lsDisplayValue;
//           } else if (mp.options.startHidden) {
//             mp.container.style.display = 'none';
//           }

//           // if any data came in before the view popped up, render now
//           if (mp.savedJson) {
//             for (const saved of mp.savedJson) {
//               mp.buttonShow(saved);
//             }
//           }
//         } else {
//           mp.fetchResults(mp.options.ids);
//         }
//       };

//       // when rendering a shared, full page, this div will exist
//       const fullResults = document.getElementsByClassName('mp-result-full');
//       if (fullResults.length > 0) {
//         mp.container = fullResults[0] as HTMLDivElement;

//         // Full page view
//         if (window.location.href.indexOf('&trivial=1') > 0) {
//           mp.options.showTrivial = true;
//         }

//         // profiler will be defined in the full page's head
//         window.profiler.Started = new Date('' + window.profiler.Started); // Ugh, JavaScript
//         const profilerHtml = mp.renderProfiler(window.profiler, false);
//         mp.container.insertAdjacentHTML('beforeend', profilerHtml);

//         // highight
//         mp.container.querySelectorAll('pre code').forEach((block) => mp.highlight(block as HTMLElement));

//         mp.bindDocumentEvents(RenderMode.Full);
//       } else {
//         initPopupView();
//         mp.bindDocumentEvents(RenderMode.Corner);
//       }
//     }

//     function deferInit() {
//       if (!alreadyDone) {
//         if (
//           (mp.initCondition && !mp.initCondition()) ||
//           (window.performance &&
//             window.performance.timing &&
//             window.performance.timing.loadEventEnd === 0 &&
//             wait < 10000)
//         ) {
//           setTimeout(deferInit, 100);
//           wait += 100;
//         } else {
//           alreadyDone = true;
//           if (mp.options.authorized) {
//             document.head.insertAdjacentHTML(
//               'beforeend',
//               `<link rel="stylesheet" type="text/css" href="${mp.options.path}includes.min.css?v=${mp.options.version}" />`
//             );
//           }
//           doInit();
//         }
//       }
//     }

//     function onLoad() {
//       mp.installAjaxHandlers();
//       deferInit();
//     }

//     if (document.readyState === 'loading') {
//       document.addEventListener('DOMContentLoaded', onLoad);
//     } else {
//       onLoad();
//     }

//     return this;
//   };

//   public listInit = (options: IOptions) => {
//     const mp = this;
//     const opt = (this.options = options || ({} as IOptions));

//     function updateGrid(id?: string) {
//       const getTiming = (profiler: IProfiler, name: string) =>
//         profiler.ClientTimings.Timings.filter((t) => t.Name === name)[0] || { Name: name, Duration: '', Start: '' };

//       document.documentElement.classList.add('mp-scheme-' + opt.colorScheme.toLowerCase());
//       fetch(opt.path + 'results-list?last-id=' + id, {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((data) => data.json())
//         .then((data: IProfiler[]) => {
//           let html = '';
//           data.forEach((profiler) => {
//             html +=
//               `
// <tr>
// <td><a href="${options.path}results?id=${profiler.Id}">${mp.htmlEscape(profiler.Name)}</a></td>
// <td>${mp.htmlEscape(profiler.MachineName)}</td>
// <td class="mp-results-index-date">${profiler.Started}</td>
// <td>${profiler.DurationMilliseconds}</td>` +
//               (profiler.ClientTimings
//                 ? `
// <td>${getTiming(profiler, 'requestStart').Start}</td>
// <td>${getTiming(profiler, 'responseStart').Start}</td>
// <td>${getTiming(profiler, 'domComplete').Start}</td> `
//                 : `
// <td colspan="3" class="mp-results-none">(no client timings)</td>`) +
//               `
// </tr>`;
//           });
//           document.querySelector('.mp-results-index').insertAdjacentHTML('beforeend', html);
//           const oldId = id;
//           const oldData = data;
//           setTimeout(() => {
//             let newId = oldId;
//             if (oldData.length > 0) {
//               newId = oldData[oldData.length - 1].Id;
//             }
//             updateGrid(newId);
//           }, 4000);
//         });
//     }
//     updateGrid();
//   };

//   private fetchResults = (ids: string[]) => {
//     for (let i = 0; ids && i < ids.length; i++) {
//       const id = ids[i];
//       const request = new ResultRequest(id, id === this.options.currentId ? this.clientPerfTimings : null);
//       const mp = this;

//       if (!id || mp.fetchStatus.hasOwnProperty(id)) {
//         continue; // empty id or already fetching
//       }

//       const isoDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:Z|(\+|-)([\d|:]*))?$/;
//       const parseDates = (key: string, value: any) =>
//         key === 'Started' && typeof value === 'string' && isoDate.exec(value) ? new Date(value) : value;

//       mp.fetchStatus[id] = 'Starting fetch';

//       fetch(this.options.path + 'results', {
//         method: 'POST',
//         body: JSON.stringify(request),
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((data) => data.text())
//         .then((text) => JSON.parse(text, parseDates))
//         .then((json) => {
//           mp.fetchStatus[id] = 'Fetch succeeded';
//           if (json instanceof String) {
//             // hidden
//           } else {
//             mp.buttonShow(json as IProfiler);
//           }
//           mp.fetchStatus[id] = 'Fetch complete';
//         })
//         .catch(function (error) {
//           mp.fetchStatus[id] = 'Fetch complete';
//         });
//     }
//   };

//   private processJson = (profiler: IProfiler) => {
//     const result: IProfiler = { ...profiler };
//     const mp = this;

//     result.CustomTimingStats = {};
//     result.CustomLinks = result.CustomLinks || {};
//     result.AllCustomTimings = [];

//     function processTiming(timing: ITiming, parent: ITiming, depth: number) {
//       timing.DurationWithoutChildrenMilliseconds = timing.DurationMilliseconds;
//       timing.DurationOfChildrenMilliseconds = 0;
//       timing.Parent = parent;
//       timing.Depth = depth;
//       timing.HasDuplicateCustomTimings = {};
//       timing.HasWarnings = {};

//       for (const child of timing.Children || []) {
//         processTiming(child, timing, depth + 1);
//         timing.DurationWithoutChildrenMilliseconds -= child.DurationMilliseconds;
//         timing.DurationOfChildrenMilliseconds += child.DurationMilliseconds;
//       }

//       // do this after subtracting child durations
//       if (timing.DurationWithoutChildrenMilliseconds < mp.options.trivialMilliseconds) {
//         timing.IsTrivial = true;
//         result.HasTrivialTimings = true;
//       }

//       function ignoreDuplicateCustomTiming(customTiming: ICustomTiming) {
//         return (
//           customTiming.ExecuteType && mp.options.ignoredDuplicateExecuteTypes.indexOf(customTiming.ExecuteType) > -1
//         );
//       }

//       if (timing.CustomTimings) {
//         timing.CustomTimingStats = {};
//         timing.HasCustomTimings = true;
//         result.HasCustomTimings = true;
//         for (const customType of Object.keys(timing.CustomTimings)) {
//           const customTimings = timing.CustomTimings[customType] || ([] as ICustomTiming[]);
//           const customStat = {
//             Duration: 0,
//             Count: 0,
//           };
//           const duplicates: { [id: string]: boolean } = {};
//           for (const customTiming of customTimings) {
//             // Add to the overall list for the queries view
//             result.AllCustomTimings.push(customTiming);
//             customTiming.Parent = timing;
//             customTiming.CallType = customType;

//             customStat.Duration += customTiming.DurationMilliseconds;

//             const ignored = ignoreDuplicateCustomTiming(customTiming);
//             if (!ignored) {
//               customStat.Count++;
//             }
//             if (customTiming.Errored) {
//               timing.HasWarnings[customType] = true;
//               result.HasWarning = true;
//             }

//             if (customTiming.CommandString && duplicates[customTiming.CommandString]) {
//               customTiming.IsDuplicate = true;
//               timing.HasDuplicateCustomTimings[customType] = true;
//               result.HasDuplicateCustomTimings = true;
//             } else if (!ignored) {
//               duplicates[customTiming.CommandString] = true;
//             }
//           }
//           timing.CustomTimingStats[customType] = customStat;
//           if (!result.CustomTimingStats[customType]) {
//             result.CustomTimingStats[customType] = {
//               Duration: 0,
//               Count: 0,
//             };
//           }
//           result.CustomTimingStats[customType].Duration += customStat.Duration;
//           result.CustomTimingStats[customType].Count += customStat.Count;
//         }
//       } else {
//         timing.CustomTimings = {};
//       }
//     }

//     processTiming(result.Root, null, 0);
//     this.processCustomTimings(result);

//     return result;
//   };

//   private processCustomTimings = (profiler: IProfiler) => {
//     const result = profiler.AllCustomTimings;

//     result.sort((a, b) => a.StartMilliseconds - b.StartMilliseconds);

//     function removeDuration(list: IGapTiming[], duration: IGapTiming) {
//       const newList: IGapTiming[] = [];
//       for (const item of list) {
//         if (duration.start > item.start) {
//           if (duration.start > item.finish) {
//             newList.push(item);
//             continue;
//           }
//           newList.push({ start: item.start, finish: duration.start } as IGapTiming);
//         }

//         if (duration.finish < item.finish) {
//           if (duration.finish < item.start) {
//             newList.push(item);
//             continue;
//           }
//           newList.push({ start: duration.finish, finish: item.finish } as IGapTiming);
//         }
//       }

//       return newList;
//     }

//     function processTimes(elem: ITiming) {
//       const duration = {
//         start: elem.StartMilliseconds,
//         finish: elem.StartMilliseconds + elem.DurationMilliseconds,
//       } as IGapTiming;
//       elem.richTiming = [duration];
//       if (elem.Parent != null) {
//         elem.Parent.richTiming = removeDuration(elem.Parent.richTiming, duration);
//       }

//       for (const child of elem.Children || []) {
//         processTimes(child);
//       }
//     }

//     processTimes(profiler.Root);
//     // sort results by time
//     result.sort((a, b) => a.StartMilliseconds - b.StartMilliseconds);

//     function determineOverlap(gap: IGapInfo, node: ITiming) {
//       let overlap = 0;
//       for (const current of node.richTiming) {
//         if (current.start > gap.finish) {
//           break;
//         }
//         if (current.finish < gap.start) {
//           continue;
//         }

//         overlap += Math.min(gap.finish, current.finish) - Math.max(gap.start, current.start);
//       }
//       return overlap;
//     }

//     function determineGap(gap: IGapInfo, node: ITiming, match: IGapReason) {
//       const overlap = determineOverlap(gap, node);
//       if (match == null || overlap > match.duration) {
//         match = { name: node.Name, duration: overlap };
//       } else if (match.name === node.Name) {
//         match.duration += overlap;
//       }

//       for (const child of node.Children || []) {
//         match = determineGap(gap, child, match);
//       }
//       return match;
//     }

//     let time = 0;
//     result.forEach((elem) => {
//       elem.PrevGap = {
//         duration: (elem.StartMilliseconds - time).toFixed(2),
//         start: time,
//         finish: elem.StartMilliseconds,
//       } as IGapInfo;

//       elem.PrevGap.Reason = determineGap(elem.PrevGap, profiler.Root, null);

//       time = elem.StartMilliseconds + elem.DurationMilliseconds;
//     });

//     if (result.length > 0) {
//       const me = result[result.length - 1];
//       me.NextGap = {
//         duration: (profiler.Root.DurationMilliseconds - time).toFixed(2),
//         start: time,
//         finish: profiler.Root.DurationMilliseconds,
//       } as IGapInfo;
//       me.NextGap.Reason = determineGap(me.NextGap, profiler.Root, null);
//     }

//     return result;
//   };

//   private htmlEscape = (orig: string) =>
//     (orig || '')
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#039;');

//   private renderProfiler = (json: IProfiler, isNew: boolean) => {
//     const p = this.processJson(json);
//     const mp = this;
//     const encode = this.htmlEscape;
//     const duration = (milliseconds: number | undefined, decimalPlaces?: number) => {
//       if (milliseconds === undefined) {
//         return '';
//       }
//       return (milliseconds || 0).toFixed(decimalPlaces === undefined ? 1 : decimalPlaces);
//     };

//     return `
// <div class="mp-result${this.options.showTrivial ? ' show-trivial' : ''}${
//       this.options.showChildrenTime ? ' show-columns' : ''
//     }${isNew ? ' new' : ''}">
//   <div class="mp-button${p.HasWarning ? ' mp-button-warning' : ''}" title="${encode(p.Name)}">
//     <span class="mp-number">${duration(p.DurationMilliseconds)} <span class="mp-unit">ms</span></span>
//     ${p.HasDuplicateCustomTimings || p.HasWarning ? '<span class="mp-warning">!</span>' : ''}
//   </div>
//   <div class="mp-popup">
//     <div class="mp-info">
//       <div>
//         <div class="mp-name">${encode(p.Name)}</div>
//         <div class="mp-machine-name">${encode(p.MachineName)}</div>
//       </div>
//       <div>
//         <div class="mp-overall-duration">(${duration(p.DurationMilliseconds)} ms)</div>
//         <div class="mp-started">${p.Started ? p.Started.toUTCString() : ''}</div>
//       </div>
//     </div>
//     <div class="mp-output">
//       ${timingsTable}
//   ${customTimings()}
//       ${clientTimings()}
//       <div class="mp-links">
//         <a href="${this.options.path}results?id=${p.Id}" class="mp-share-mp-results" target="_blank">share</a>
//         ${Object.keys(p.CustomLinks)
//           .map((k) => `<a href="${p.CustomLinks[k]}" class="mp-custom-link" target="_blank">${k}</a>`)
//           .join('')}
//       <span>
//           <a class="mp-toggle-columns" title="shows additional columns">more columns</a>
//           <a class="mp-toggle-columns mp-more-columns" title="hides additional columns">fewer columns</a>
//           ${
//             p.HasTrivialTimings
//               ? `
//           <a class="mp-toggle-trivial" title="shows any rows with &lt; ${this.options.trivialMilliseconds} ms duration">show trivial</a>
//           <a class="mp-toggle-trivial mp-trivial" title="hides any rows with &lt; ${this.options.trivialMilliseconds} ms duration">hide trivial</a>`
//               : ''
//           }
//         </span>
//       </div>
//     </div>
//   </div>
//   ${profilerQueries()}
// </div>`;
//   };

//   private buttonShow = (json: IProfiler) => {
//     if (!this.container) {
//       // container not rendered yet
//       this.savedJson.push(json);
//       return;
//     }

//     const profilerHtml = this.renderProfiler(json, true);

//     if (this.controls) {
//       this.controls.insertAdjacentHTML('beforebegin', profilerHtml);
//     } else {
//       this.container.insertAdjacentHTML('beforeend', profilerHtml);
//     }

//     // limit count to maxTracesToShow, remove those before it
//     const results = this.container.querySelectorAll('.mp-result');
//     const toRemove = results.length - this.options.maxTracesToShow;
//     for (let i = 0; i < toRemove; i++) {
//       results[i].parentNode.removeChild(results[i]);
//     }
//   };

//   private scrollToQuery = (link: HTMLElement, queries: HTMLElement) => {
//     const id = link.closest('tr').dataset.timingId;
//     const rows = queries.querySelectorAll('tr[data-timing-id="' + id + '"]');
//     rows.forEach((n) => n.classList.add('highlight'));
//     if (rows && rows[0]) {
//       rows[0].scrollIntoView();
//     }
//   };

//   // some elements want to be hidden on certain doc events
//   private bindDocumentEvents = (mode: RenderMode) => {
//     const mp = this;
//     // Common handlers
//     document.addEventListener(
//       'click',
//       function (event) {
//         const target = event.target as HTMLElement;
//         if (target.matches('.mp-toggle-trivial')) {
//           target.closest('.mp-result').classList.toggle('show-trivial');
//         }
//         if (target.matches('.mp-toggle-columns')) {
//           target.closest('.mp-result').classList.toggle('show-columns');
//         }
//         if (target.matches('.mp-toggle-trivial-gaps')) {
//           target.closest('.mp-queries').classList.toggle('show-trivial');
//         }
//       },
//       false
//     );

//     // Full vs. Corner handlers
//     if (mode === RenderMode.Full) {
//       // since queries are already shown, just highlight and scroll when clicking a '1 sql' link
//       document.addEventListener('click', function (event) {
//         const target = event.target as HTMLElement;
//         const queriesButton = target.closest<HTMLElement>('.mp-popup .mp-queries-show');
//         if (queriesButton) {
//           mp.scrollToQuery(queriesButton, document.body.querySelector('.mp-queries'));
//         }
//       });
//       document.documentElement.classList.add('mp-scheme-' + mp.options.colorScheme.toLowerCase());
//     } else {
//       document.addEventListener('click', function (event) {
//         const target = event.target as HTMLElement;
//         const button = target.closest<HTMLElement>('.mp-button');
//         if (button) {
//           const popup = button.parentElement.querySelector<HTMLDivElement>('.mp-popup');
//           const wasActive = button.parentElement.classList.contains('active');
//           const pos = mp.options.renderPosition;

//           const parent = button.parentElement;
//           parent.classList.remove('new');

//           const allChildren = button.parentElement.parentElement.children;
//           for (let i = 0; i < allChildren.length; i++) {
//             // Set Active only on the curent button
//             allChildren[i].classList.toggle('active', allChildren[i] == parent);
//           }

//           if (!wasActive) {
//             // move left or right, based on config
//             popup.style[pos === RenderPosition.Left || pos === RenderPosition.BottomLeft ? 'left' : 'right'] = `${
//               button.offsetWidth - 1
//             }px`;

//             // is this rendering on the bottom (if no, then is top by default)
//             if (pos === RenderPosition.BottomLeft || pos === RenderPosition.BottomRight) {
//               const bottom =
//                 window.innerHeight - button.getBoundingClientRect().top - button.offsetHeight + window.scrollY; // get bottom of button
//               popup.style.bottom = '0';
//               popup.style.maxHeight = 'calc(100vh - ' + (bottom + 25) + 'px)';
//             } else {
//               popup.style.top = '0';
//               popup.style.maxHeight =
//                 'calc(100vh - ' + (button.getBoundingClientRect().top - window.window.scrollY + 25) + 'px)';
//             }
//           }
//           return;
//         }
//         const queriesButton = target.closest<HTMLElement>('.mp-queries-show');
//         if (queriesButton) {
//           // opaque background
//           document.body.insertAdjacentHTML('beforeend', '<div class="mp-overlay"><div class="mp-overlay-bg"/></div>');
//           const overlay = document.querySelector('.mp-overlay');
//           const queriesOrig = queriesButton.closest('.mp-result').querySelector('.mp-queries');
//           const queries = queriesOrig.cloneNode(true) as HTMLDivElement;
//           queries.style.display = 'block';
//           overlay.classList.add('mp-scheme-' + mp.options.colorScheme.toLowerCase());
//           overlay.appendChild(queries);

//           mp.scrollToQuery(queriesButton, queries);

//           // syntax highlighting
//           queries.querySelectorAll('pre code').forEach((block) => mp.highlight(block as HTMLElement));
//           return;
//         }
//       });
//       // Background and esc binding to close popups
//       const tryCloseActive = (event: MouseEvent | KeyboardEvent) => {
//         const target = event.target as HTMLElement;
//         const active = document.querySelector<HTMLElement>('.mp-result.active');
//         if (!active) {
//           return;
//         }

//         const bg = document.querySelector<HTMLDivElement>('.mp-overlay');
//         const isEscPress = event.type === 'keyup' && event.which === 27;
//         const isBgClick = event.type === 'click' && !target.closest('.mp-queries, .mp-results');

//         if (isEscPress || isBgClick) {
//           if (bg && bg.offsetParent !== null) {
//             bg.remove();
//           } else {
//             active.classList.remove('active');
//           }
//         }
//       };
//       document.addEventListener('click', tryCloseActive);
//       document.addEventListener('keyup', tryCloseActive);

//       if (mp.options.toggleShortcut && !mp.options.toggleShortcut.match(/^None$/i)) {
//         /**
//          * Based on http://www.openjs.com/scripts/events/keyboard_shortcuts/
//          * Version : 2.01.B
//          * By Binny V A
//          * License : BSD
//          */
//         const keys = mp.options.toggleShortcut.toLowerCase().split('+');

//         document.addEventListener(
//           'keydown',
//           function (e) {
//             let element = e.target as HTMLElement;
//             if (element.nodeType == 3) {
//               element = element.parentElement;
//             }
//             if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') {
//               return;
//             }

//             // Find Which key is pressed
//             let code;
//             if (e.keyCode) {
//               code = e.keyCode;
//             } else if (e.which) {
//               code = e.which;
//             }

//             let character = String.fromCharCode(code).toLowerCase();
//             if (code == 188) {
//               character = ',';
//             } // If the user presses , when the type is onkeydown
//             if (code == 190) {
//               character = '.';
//             } // If the user presses , when the type is onkeydown

//             // Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
//             let kp = 0;
//             // Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
//             const shift_nums = {
//               '`': '~',
//               1: '!',
//               2: '@',
//               3: '#',
//               4: '$',
//               5: '%',
//               6: '^',
//               7: '&',
//               8: '*',
//               9: '(',
//               0: ')',
//               '-': '_',
//               '=': '+',
//               ';': ':',
//               "'": '"',
//               ',': '<',
//               '.': '>',
//               '/': '?',
//               '\\': '|',
//             };
//             // Special Keys - and their codes
//             const special_keys = {
//               esc: 27,
//               escape: 27,
//               tab: 9,
//               space: 32,
//               return: 13,
//               enter: 13,
//               backspace: 8,

//               scrolllock: 145,
//               scroll_lock: 145,
//               scroll: 145,
//               capslock: 20,
//               caps_lock: 20,
//               caps: 20,
//               numlock: 144,
//               num_lock: 144,
//               num: 144,

//               pause: 19,
//               break: 19,

//               insert: 45,
//               home: 36,
//               delete: 46,
//               end: 35,

//               pageup: 33,
//               page_up: 33,
//               pu: 33,

//               pagedown: 34,
//               page_down: 34,
//               pd: 34,

//               left: 37,
//               up: 38,
//               right: 39,
//               down: 40,

//               f1: 112,
//               f2: 113,
//               f3: 114,
//               f4: 115,
//               f5: 116,
//               f6: 117,
//               f7: 118,
//               f8: 119,
//               f9: 120,
//               f10: 121,
//               f11: 122,
//               f12: 123,
//             };

//             const modifiers = {
//               shift: { wanted: false },
//               ctrl: { wanted: false },
//               alt: { wanted: false },
//             };

//             for (let i = 0; i < keys.length; i++) {
//               const k = keys[i];
//               if (k == 'ctrl' || k == 'control') {
//                 kp++;
//                 modifiers.ctrl.wanted = true;
//               } else if (k == 'shift') {
//                 kp++;
//                 modifiers.shift.wanted = true;
//               } else if (k == 'alt') {
//                 kp++;
//                 modifiers.alt.wanted = true;
//               } else if (k.length > 1) {
//                 // If it is a special key
//                 if (special_keys[k] == code) {
//                   kp++;
//                 }
//               } else {
//                 // The special keys did not match
//                 if (character == k) {
//                   kp++;
//                 } else if (shift_nums[character] && e.shiftKey) {
//                   // Stupid Shift key bug created by using lowercase
//                   character = shift_nums[character];
//                   if (character == k) {
//                     kp++;
//                   }
//                 }
//               }
//             }
//             if (
//               kp == keys.length &&
//               e.ctrlKey == modifiers.ctrl.wanted &&
//               e.shiftKey == modifiers.shift.wanted &&
//               e.altKey == modifiers.alt.wanted
//             ) {
//               const results = document.querySelector<HTMLElement>('.mp-results');
//               const newValue = results.style.display == 'none' ? 'block' : 'none';
//               results.style.display = newValue;
//               try {
//                 window.localStorage.setItem('MiniProfiler-Display', newValue);
//               } catch (e) {}
//             }
//           },
//           false
//         );
//       }
//     }
//   };

//   private initControls = (container: HTMLDivElement) => {
//     if (this.options.showControls) {
//       container.insertAdjacentHTML(
//         'beforeend',
//         '<div class="mp-controls"><span class="mp-min-max" title="Minimize">m</span><span class="mp-clear" title="Clear">c</span></div>'
//       );
//       this.controls = container.querySelector<HTMLDivElement>('.mp-controls');

//       const minMax = container.querySelector<HTMLSpanElement>('.mp-controls .mp-min-max');
//       minMax.addEventListener('click', function () {
//         container.classList.toggle('mp-min');
//       });

//       const clear = container.querySelector<HTMLSpanElement>('.mp-controls .mp-clear');
//       clear.addEventListener('click', function () {
//         const results = container.querySelectorAll('.mp-result');
//         results.forEach((item) => {
//           item.parentNode.removeChild(item);
//         });
//       });
//     } else {
//       container.classList.add('mp-no-controls');
//     }
//   };

//   private installAjaxHandlers = () => {
//     const mp = this;

//     function handleIds(jsonIds: string) {
//       if (jsonIds) {
//         const ids: string[] = JSON.parse(jsonIds);
//         mp.fetchResults(ids);
//       }
//     }

//     // wrap fetch
//     if (window.fetch) {
//       const windowFetch = window.fetch;
//       window.fetch = (input, init) => {
//         return windowFetch(input, init).then((response) => {
//           handleIds(response.headers.get('X-MiniProfiler-Ids'));
//           return response;
//         });
//       };
//     }
//   };
// }
