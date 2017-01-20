$(function() {
  var templates = {},
    photos;

  $("script[type='text/x-handlebars']").each(function() {
    var $template = $(this);
    templates[$template.attr('id')] = Handlebars.compile($template.html());
  });

  $("[data-type='partial']").each(function() {
    var $partial = $(this);
    Handlebars.registerPartial($partial.attr('id'), $partial.html());
  });

  $.ajax({
    url: '/photos',
    data: 'JSON',
    success: function(json) {
      photos = json;

      renderPhotos();
      renderPhotoInformation(0);
      getCommentsFor(photos[0].id);
    },
    error: function() {
      console.log('AJAX request failed');
    }
  });

  function renderPhotos() {
    $('#slides').append(templates.photos({photos: photos}));
  }

  function renderPhotoInformation(id) {
    $('section > header').append(templates.photo_information(photos[id]));
  }

  function getCommentsFor(i) {
    $.ajax({
      url: '/comments',
      data: 'photo_id=' + i,
      success: function(json) {
        var comments = json;
        $('#comments ul').html(templates.comments({comments: comments}));
      },
      error: function() {
        console.log('AJAX request failed');
      }
    });
  }
});
