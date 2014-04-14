$(function() {
  var strHtmlOutput = '';
  $.ajax('/project/byuser/' + userId, {
    dataType: 'json',
    error: function() {
      console.log("ajax error :(");
    },
    success: function(data) {
      if (data.length > 0) {
        if (data.status && data.status === 'error') {
          strHtmlOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem
            , totalItems = data.length
            , arrLi = [];
          for (intItem = totalItems - 1; intItem >= 0; intItem--) {
            arrLi.push('<a href="/project/' + data[intItem]._id + '">' + data[intItem].projectName + '</a>');
          }
          strHtmlOutput = '<li>' + arrLi.join('</li><li>') + '</li>';
        }
      } else {
        strHtmlOutput = "<li>You haven't created any projects yet</li>";
      }
      $('#myprojects').html(strHtmlOutput);
    }
  });
});
