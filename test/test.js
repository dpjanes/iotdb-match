/*
 *  test.js
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

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const matcher = require("..")

const yaml = require("js-yaml")

const path = require("path")
const assert = require("assert")

describe("test", function() {
    let tests = null;

    before(function(done) {
        _.promise.make({
            path: path.join(__dirname, "data"),
            filter: name => name.endsWith(".yaml"),
        })
            .then(fs.list)
            .then(fs.all(fs.read.utf8))
            .then(_.promise.make(sd => {
                sd.outputs.forEach(output => {
                    const ds = yaml.safeLoadAll(output.document)
                    assert.ok(ds.length === 2, output);

                    output.template = ds[0]
                    output.events = ds[1]
                })

                tests = sd.outputs;
            }))
            .then(_.promise.done(done))
            .catch(done)

    })

    it("works", function() {
        tests.forEach(test => {
            test.events.forEach(event => {
                const result = matcher.match(test.template, event)
                if (result !== event.expect) {
                    console.log("===")
                    console.log("path:", test.path)
                    console.log("template:", test.template)
                    console.log("event:", event)
                    console.log("===")
                    throw new Error("fail");
                }
            })
        })
    })
})
