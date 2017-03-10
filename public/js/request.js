$(document).ready(function() {
  setInterval('updateData()', 500);
});

function updateData() {
  $(function() {
    $.get('/ajax', function(res) {
      console.log(res);
    });
  });
}
