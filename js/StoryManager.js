function StoryManager() {

    var self = {};

    var frontPage,backPage,titlePage,vizPage,sidePage;

    var answers = [];

    var currentPage,
        currentPageNumber = 0;

    var questionTime;

    var userId =  "user" + parseInt(Math.random() * 100000);



    self.pages = [

        {   type : 'task',
            mode : 'multi',
            image  : 'tasks/compare01-A.png',
            hideImage : true,
            title : "How many nodes are connected with node <b>(A)</b>",
            options : ["A","B","C","D","E","F","G","H","I","L"]
        },

        {type : 'full', image:'intro/welcome.png'},
        {type : 'full', image:'intro/graph01.png'},
        {type : 'full', image:'intro/bubbleset.png'},
        {type : 'full', image:'intro/linesets.png'},
        {type : 'full', image:'intro/branchingsets.png'},

        {   type : 'task',
            mode : 'multi',
            image  : 'intro01.png',
            hideImage : true,
            title : "How many nodes are connected with node <b>(A)</b>",
            options : ["A","B","C","D","E","F","G","H","I","L"]
        },
        {   type : 'task',
            mode : 'single',
            id  : 'question1',
            image  : 'intro01.png',
            title : "question 2: what",
            options : ["Asd","asdasd","dsad"]
        },
        {   type : 'task',
            mode : 'single',
            id  : 'question3',
            image  : 'intro01.png',
            title : "question 2: what",
            options : ["Asd","asdasd","dsad"]
        },

        {   type : 'task',
            mode : 'single',
            id  : 'question4',
            image  : 'intro01.png',
            title : "question 3: another question",
            options : ["1sdas2","www","qwe"]
        },
        {type : 'full', image:'thanks.png'}

    ];


    self.nextPage = function () {

        //submit at the last slide
        if(currentPageNumber == self.pages.length - 1){
            submitResults();
            console.log("results submitted");
        } else if(currentPageNumber == self.pages.length){
            //END PRESENTATION
            return;
        }

        currentPage = self.pages[currentPageNumber];

        if(currentPage.type === 'full'){
            displayFullPage(currentPage.image);
        } else if(currentPage.type === 'task'){
            displayTaskPage(currentPage, {deactivateButtons: false, hideImage : currentPage.hideImage});
        } else if(currentPage.type === 'intro-task'){
            displayTaskPage(currentPage, {deactivateButtons: true});
        }

        currentPageNumber += 1;
    };


    var displayFullPage = function (imgUrl) {
        frontPage.html("");
        frontPage.css("background-image", "url(res/"+ imgUrl + ")");

        frontPage.show();
        backPage.hide();
    };

    var displayTaskPage = function (page, params) {
        frontPage.hide();
        backPage.show();



        titlePage.html('').append('<p class="question-text">'+ page.title +'<p>');
        $(".question-text").hide().fadeIn();

        //var list = d3.selectAll(sidePage.toArray()).html('')
        //    .append('ul')
        //    .classed('options-list', true);
        //
        //list.selectAll('li').data(page.options).enter()
        //    .append('li')
        //    .text(function (d) {
        //        return d;
        //    })
        var list = d3.selectAll(sidePage.toArray()).html('')
            .append('div')
            .classed('options-list', true);

        list.selectAll('.option').data(page.options).enter()
            .append('div')
                .text(function (d) {
                    return d;
                })
            .classed('option', true)
            .on('click', function (d,i) {
                if(!params.deactivateButtons){
                    if(page.mode == 'single'){
                        d3.select(this).classed('selected', true);
                        setTimeout(function () {
                            setAnswer(i);
                            self.nextPage();
                        }, 200)
                    } else if (page.mode == 'multi'){
                        d3.select(this).classed('selected',!d3.select(this).classed('selected'))
                    }
                }
            });

        if(page.mode == 'multi'){
            d3.selectAll(sidePage.toArray())
                .append('div')
                .classed('button',true)
                .text('SUBMIT')
                .on('click', function () {
                    if(!params.deactivateButtons){

                        var answer = [];
                        d3.selectAll('li.selected').each(function (d,i) {
                            answer.push(i);
                        });
                        setAnswer(answer);
                        self.nextPage();
                    }
                });
        }

        //image
        var image = d3.selectAll(vizPage.toArray()).html('').append('div')
            .classed('viz-image', true);

        if(params.deactivateButtons) {
            //dummy task
            image.style("background-image", "url(res/"+ page.image + ")")
                .on('click', function () {
                    self.nextPage();
                });
        } else {
            image.style("background-image", function () {
                if(params.hideImage){
                    return "url(res/clicktoview.png)";
                }else{
                    return "url(res/"+ page.image + ")";
                }
            } ).on('click', function () {
                image.style("background-image", "url(res/"+ page.image + ")");
            });
        }


        //

        questionTime = new Date().getTime();

    };

    var setAnswer = function (i) {
        var time = new Date().getTime() - questionTime;
        answers.push({id: currentPage.id, answer: i, time: time});
    };

    var submitResults = function () {
        var data = {user: userId, answers : answers};

        $.ajax
        ({
            type: "POST",
            url: "http://fpadua2.people.uic.edu/parallax/store.php",
            dataType: 'json',
            async: true,
            //json object to sent to the authentication url
            data: data,
            success: function (json) {
                alert("result " + json.result);
            }

        });
    };


    var init = function () {
        frontPage = $('#front-page');
        backPage = $('#back-page');
        titlePage = $('#title-page');
        vizPage = $('#viz-page');
        sidePage = $('#side-page');


        frontPage.on("click", self.nextPage);
    }();


    return self;

}