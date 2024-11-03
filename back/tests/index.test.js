const Todos = require('./index');
const assert = require('assert').strict;
const fs = require('fs');


describe('Todos Test Group', function() {
    it("should be able to add and complete TODOs", function() {
        let todos = new Todos();
        assert.strictEqual(todos.list().length, 0);

        todos.add("run code");
        assert.strictEqual(todos.list().length, 1);
        assert.deepStrictEqual(todos.list(), [{title: "run code", completed: false}]);

        todos.add("test everything");
        assert.strictEqual(todos.list().length, 2);
        assert.deepStrictEqual(todos.list(),
            [
                { title: "run code", completed: false },
                { title: "test everything", completed: false }
            ]
        );

        todos.complete("run code");
        assert.deepStrictEqual(todos.list(),
            [
                { title: "run code", completed: true },
                { title: "test everything", completed: false }
            ]
        );

        // const expectedError = new Error(`No TODO was found with the title: "run code"`);
        // assert.throws(() => {
        //     todos.complete("run code");
        // },expectedError);
    });


    describe("saveToFile()", function() {
    //  beforeEach(function () {
    //     this.todos = new Todos();
    //     this.todos.add("save a CSV");
    // });

    // afterEach(function () {
    //     if (fs.existsSync("todos.csv")) {
    //         fs.unlinkSync("todos.csv");
    //     }
    // });

        it("should save a single TODO", function(done) {
            let todos = new Todos();
            todos.add("save a CSV");
            todos.saveToFile((err) => {
                assert.strictEqual(fs.existsSync('todos.csv'), true);
                let expectedFileContents = "Title,Completed\nsave a CSV,false\n";
                let content = fs.readFileSync("todos.csv").toString();

                console.log(content);
                assert.strictEqual(content, expectedFileContents);
                done(err);
            });
        });


        it("should save a single TODO that's completed", function (done) {
            let todos = new Todos();
            todos.add("save a CSV");
            todos.complete("save a CSV");
            todos.saveToFile((err) => {
                assert.strictEqual(fs.existsSync('todos.csv'), true);
                let expectedFileContents = "Title,Completed\nsave a CSV,true\n";
                let content = fs.readFileSync("todos.csv").toString();

                console.log(content);
                assert.strictEqual(content, expectedFileContents);
                done(err);
            });
        });
    });

})
