class Veggieburger
  settings =
    toggle: '[data-toggle]',
    toggledClass: 'open',
    # Optional closed class can be applied on (and ever after) first close
    closedClass: null,
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
    @toggle = @multiToggle settings.toggle
    @toggledClass = settings.toggledClass
    @closedClass = if settings.closedClass != null then settings.closedClass else null
    @closer = if settings.closer != null then $(settings.closer) else null
    @prevent = settings.preventDefault
    @outside = settings.outside

    @toggleable = [@$el]
    # Add initial and additional toggles
    for t in @toggle
      @toggleable.push t

    console.log @toggleable

    # Uncomment this to log settings for debugging
    # console.log settings;
    @bindToggle()

  # For assigning additional toggleable elements
  # Pass in a setting and get back an array with one or more jQuery objects
  multiToggle: (setting) ->
    result = []
    # Using pre IE 8 pattern for maximum compatibility
    if Object.prototype.toString.call(setting) == '[object Array]'
      # Multiple result
      for s in setting
        result.push $(s)
      return result
    else
      # Singular result
      result.push $(setting)
      return result

  toggleAll: ->
    toggled = false
    for t in @toggleable
      # If closed class has been applied, toggle it
      if t.hasClass @closedClass
        t.toggleClass @closedClass
      # Always toggle the open class
      t.toggleClass @toggledClass
      if t.hasClass @toggledClass
        toggled = true
    if toggled
      @bindClose()
    else
      @unbindClose()
      # Add closed class if it's set in the options
      if @closedClass != null
        for t in @toggleable
          t.toggleClass @closedClass

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
