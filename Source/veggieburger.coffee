class Veggieburger
  settings =
    toggle: '[data-toggle]',
    toggledClass: 'open',
    closer: null,
    # Prevent Default can be set to false if necessary
    preventDefault: true,
    # Set outside to true if you want clicks outside the toggleable
    # elements to close the toggle
    outside: false,
    # Touch requires TouchSwipe.js and is disabled by default
    # https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
    touch: false

  constructor: (el, options) ->
    @$el = $(el)
    @settings = $.extend settings, options
    @toggle = $(settings.toggle)
    @toggledClass = settings.toggledClass
    @closer = if settings.closer != null then $(settings.closer) else null
    @prevent = settings.preventDefault
    @outside = settings.outside

    @toggleable = [@$el, @toggle]

    # Uncomment this to log settings for debugging
    # console.log settings;
    @bindToggle()

  toggleAll: ->
    toggled = false
    for t in @toggleable
      t.toggleClass @toggledClass
      if t.hasClass @toggledClass
        toggled = true
    if toggled
      @bindClose()
    else
      @unbindClose()

  bindToggle: ->
    @$el.click (event) =>
      if @prevent
        event.preventDefault()
      @toggleAll()

  # returns true if event target is outside the toggleable elements
  outHide: (e) ->
    hit = true
    for t in @toggleable
      if $(e.target).closest(t).length
        hit = false
    return hit

  bindClose: ->
    $('body').bind("mouseup touchend", (e) =>
      if @outside && @outHide(e)
        @toggleAll()
    )
    if settings.touch == true
      @$el.swipe("enable")
      @$el.swipe({
        swipeLeft: (event, direction) =>
          @toggleAll()
      });
    if @closer != null
      @closer.bind("click", (e) =>
        if @prevent
          event.preventDefault()
        @toggleAll()
    )

  unbindClose: ->
    $('body').unbind()
    if settings.touch == true
      @$el.swipe("disable")
    if @closer != null
      @closer.unbind()



$.fn.extend
  veggieburger: (options) -> @each -> new Veggieburger(@, options)
