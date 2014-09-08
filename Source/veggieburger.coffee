class Veggieburger
  settings =
    toggle: '[data-toggle]',
    toggledClass: 'open'
    # Touch requires TouchSwipe.js and is disabled by default
    # https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
    touch: false

  constructor: (el, options) ->
    @$el = $(el)
    @settings = $.extend settings, options
    @toggle = $(settings.toggle)
    @toggledClass = settings.toggledClass
    @toggleable = [@$el, @toggle]

    console.log settings;
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
    @toggle.click( => 
      @toggleAll()
    )

  # returns true if event target is outside the toggleable elements
  outHide: (e) ->
    hit = true
    for t in @toggleable
      if $(e.target).closest(t).length
        hit = false
    return hit

  bindClose: ->
    $('body').bind("mouseup touchend", (e) =>
      if @outHide(e)
        @toggleAll()
    )
    if settings.touch == true
      @$el.swipe("enable")
      @$el.swipe({
        swipeLeft: (event, direction) =>
          @toggleAll()
      });

  unbindClose: ->
    $('body').unbind()
    if settings.touch == true
      @$el.swipe("disable")

    
    
$.fn.extend
  veggieburger: (options) -> @each -> new Veggieburger(@, options)