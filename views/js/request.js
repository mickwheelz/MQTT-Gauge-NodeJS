$(function() {
    $('#loadRequest').click(function() {
        $.get('/ajax', function(res) {
            $('#val').text(res);
        });
    });
});
