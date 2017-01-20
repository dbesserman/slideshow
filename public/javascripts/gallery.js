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

  var slideshow = {
    $el: $('#slideshow'),
    duration: 500,
    prevSlide: function(e) {
      e.preventDefault();
      var $current = this.$el.find('figure:visible'),
          $prev = $current.prev('figure');

      if (!$prev.length) {
        $prev = this.$el.find('figure').last();
      } 

      $current.fadeOut(this.duration);
      $prev.fadeIn(this.duration);
      this.renderPhotoContent($prev.data('id'));
    },
    nextSlide: function(e) {
      e.preventDefault();
      var $current = this.$el.find('figure:visible'),
          $next = $current.next('figure');

      if (!$next.length) {
        $next = this.$el.find('figure').first();
      } 

      $current.fadeOut(this.duration);
      $next.fadeIn(this.duration);
      this.renderPhotoContent($next.data('id'));
    },
    renderPhotoContent: function(i) {
      renderPhotoInformation(+i);
      getCommentsFor(i);
    },
    bind: function() {
      this.$el.find('a.prev').on('click', this.prevSlide.bind(this));
      this.$el.find('a.next').on('click', this.nextSlide.bind(this));
    },
    init: function() {
      this.bind();
    },
  }


  $.ajax({
    url: '/photos',
    data: 'JSON',
    success: function(json) {
      photos = json;

      renderPhotos();
      renderPhotoInformation(photos[0].id);
      getCommentsFor(photos[0].id);
      slideshow.init();
    },
    error: function() {
      console.log('AJAX request failed');
    }
  });

  function renderPhotos() {
    $('#slides').html(templates.photos({photos: photos}));
  }

  function renderPhotoInformation(i) {
    var photo = photos.filter(function(item) {
      return item.id === i;
    })[0];
    $('section > header').html(templates.photo_information(photo));
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
