class Veggieburger
  defaultSettings: ->
    triggers: null
    toggle: '[data-toggle]'
    toggledClass: 'open'
    # Optional closed class can be applied on (and ever after) first close
    closedClass: null
    # Additional "closer" element can be specified
    closers: null
    # Set one or more keys to trigger a "close-only" toggle
    closeKeys: null
    # Prevent Default can be set to false if necessary
    preventDefault: true
    # If true, clicks outside the toggleable elements will "close" the toggle,
    # can also be set to specific set of objects inner instead of all toggleable elements
    outside: false
    # Touch requires TouchSwipe.js and is disabled by default
    # https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
    touch: false

  constructor: (el, options) ->
    @$el = $(el)
    @settings = $.extend @defaultSettings(), options
    @triggers = if @settings.triggers != null then @multiSet @settings.triggers else [$(@$el.find(':button')[0])]
    # Use multiset function to add one or more toggleable elements, and add any triggers
    @toggleable = @multiSet @settings.toggle
    @toggleable = @toggleable.concat @triggers
    # Assign closers but only if there are any
    @closers = if @settings.closers != null then @multiSet @settings.closers else null
    @toggledClass = @settings.toggledClass
    @closedClass = if @settings.closedClass != null then @settings.closedClass else null
    @prevent = @settings.preventDefault
    # Outside is set as either a set of selectors or a boolean value
    @outside = if typeof @settings.outside != 'boolean' then @multiSet @settings.outside else @settings.outside

    # Setup an array for one or more close keys, if there are any
    if @settings.closeKeys != null
      if (Number(@settings.closeKeys)==@settings.closeKeys && @settings.closeKeys%1==0) && Object.prototype.toString.call(@settings.closeKeys) != '[object Array]'
        # CloseKeys is a single number
        @closeKeys = [@settings.closeKeys]
      else if Object.prototype.toString.call(@settings.closeKeys) == '[object Array]'
        # CloseKeys is an array
        @closeKeys = @settings.closeKeys
      else
        # CloseKeys is/are invalid
        @closeKeys = null
    else
      @closeKeys = null

    # Uncomment this to log settings for debugging
    # console.log settings;
    @bindToggle()

  # For assigning additional multiple triggers and/or toggleable elements
  # Simply pass in a setting and get back an array with one or more jQuery objects
  multiSet: (setting) ->
    result = []
    # Using pre IE 8 pattern for maximum compatibility
    if Object.prototype.toString.call(setting) == '[object Array]'
      # Multiple result
      for s in setting
          result.push @$el.find(s)
      return result
    else
      # Singular result
      result.push @$el.find(setting)
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
    for t in @triggers
      t.click (event) =>
        if @prevent
          if(event.preventDefault)
            event.preventDefault();
          else
            event.returnValue = false;
        @toggleAll()

  # returns true if event target is outside the toggleable elements
  outHide: (e) ->
    hit = true
    # If outside is set with a non-boolean value
    if typeof @outside != 'boolean' && @outside
      for o in @outside
        if $(e.target).closest(o).length
          hit = false

    # Check for outside hits on all toggleable elements if outside is a boolean value
    if typeof @outside == 'boolean' && @outside
      for t in @toggleable
        if $(e.target).closest(t).length
          hit = false
    return hit

  # Requires fat arrow as it's being called within a $(document) event
  keyClose: (e) =>
    if $.inArray(e.keyCode, @closeKeys) != -1
      @toggleAll()

  bindClose: ->
    $('body').bind("mouseup touchend", (e) =>
      if @outside && @outHide(e)
        @toggleAll()
    )
    if @settings.touch == true
      @$el.swipe("enable")
      @$el.swipe({
        swipeLeft: (event, direction) =>
          @toggleAll()
      });
    if @closers != null
      for c in @closers
        c.bind("click", (event) =>
          if @prevent
            if(event.preventDefault)
              event.preventDefault();
            else
              event.returnValue = false;
          @toggleAll()
    )
    if @closeKeys != null
      $(document).keyup @keyClose


  unbindClose: ->
    $('body').unbind()
    if @settings.touch == true
      @$el.swipe("disable")
    if @closers != null
      for c in @closers
        c.unbind()
    if @closeKeys != null
      $(document).unbind("keyup", @keyClose)


$.fn.extend
  veggieburger: (options) -> @each -> new Veggieburger(@, options)
