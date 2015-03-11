var storyManager;

$(document).ready(function() {

    storyManager = StoryManager();

    preloadAllImages(storyManager.pages).awaitAll(function () {
        storyManager.nextPage();
    });
});

var preloadAllImages = function(pages) {

    var loadingBar = d3.select('#title-page').append('div')
        .classed('loading-bar', true)
        .style('width', 0);


    var imagesQueue = queue();

    var arrayOfImages = [];

    pages.forEach(function (page) {
        if(page.image){
            arrayOfImages.push(page.image);
        }
    });

    var completed = 0;

    $(arrayOfImages).each(function () {
        var imageSrc = this;
        imagesQueue.defer(function (callback) {
            $('<img />').attr('src',"res/"+ imageSrc)
                .appendTo('body').css('display','none')
                .load(function () {
                    console.log("loaded: " + imageSrc);
                    completed += 1;

                    loadingBar.style('width',parseInt(100*(completed/arrayOfImages.length)) + '%');

                    callback(null,null);
                });
        });
    });

    return imagesQueue;
};




function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}