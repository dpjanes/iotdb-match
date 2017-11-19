/*
 *  match.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-11-19
 *
 *  Copyright [2013-2018] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const minimatch = require("minimatch");

/**
 *  Possible enhancements:
 *  - regex in templates
 *  - arrays of values in the event
 */
const match = (template, event) => {
    const method = "match";

    let all = true;

    assert.ok(_.is.Dictionary(template), `${method}: template must be a Dictionary`);
    assert.ok(_.is.Dictionary(event), `${method}: event must be a Dictionary`);

    _.mapObject(template, (template_value, template_key) => {
        // run out the clock
        if (!all) {
            return;
        }

        const event_value = event[template_key];

        if (_.is.Nullish(event_value)) {
            // the event value must be there
            all = false;
        } else if (_.is.String(template_value)) {
            // if the template is a string, it's a glob
            if (!_.is.String(event_value)) {
                all = false;
            } else if (!minimatch(event_value, template_value)) {
                all = false;
            }
        } else if (_.is.Array(template_value)) {
            // if the template is an array, we're looking for exact matches
            if (template_value.indexOf(event_value) === -1) {
                all = false;
            }
        } else {
            if (template_value !== event_value) {
                all = false;
            }
        }
    })

    return all;
}

/**
 *  API
 */
exports.match = match;
