$(function() {
  var templates = {},
    photos;

  $("script[type='text/x-handlebars']").each(function() {
    var $template = $(this);
    templates[$template.attr('id')] = Handlebars.compile($template.html());
  });

  $.ajax({
    url: '/photos',
    data: 'JSON',
    success: function(json) {
      photos = json;
      $('#slides').append(templates.photos({photos: photos}));
      $('section > header').append(templates.photo_information(photos[0]));
    },
    error: function() {
      console.log('AJAX request failed');
    }
  });
});
