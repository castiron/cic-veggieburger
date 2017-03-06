class Veggieburger
  defaultSettings: ->
    triggers: null
    # Optional data-selector to use a URL has to auto-toggle
    # The veggie burger on load
    hash: null
    toggle: '[data-toggle]'
    toggledClass: 'open'
    # Optional closed class can be applied on (and ever after) first close
    closedClass: null
    # Additional "closer" element can be specified
    closers: null
    # Set one or more keys to trigger a "close-only" toggle
    closeKeys: null
    # Transition one/more elements height or width with jQuery instead of your class
    transitionHeight: null
    transitionSpeed: 200
    # Prevent Default can be set to false if necessary
    preventDefault: true
    # If true, clicks outside the toggleable elements will "close" the toggle,
    # can also be set to specific set of objects inner instead of all toggleable elements
    outside: false
    # Touch requires TouchSwipe.js and is disabled by default
    # https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
    touch: false
    # Functions to run when veggieburger is toggled
    onToggleOn: ->
    onToggleOff: ->
    afterHeightOff: ->

  constructor: (el, options) ->
    # Utility methods
    @util = {
      snakeToCamel: (string) ->
        string.replace(/(\-\w)/g, (m) -> m[1].toUpperCase())
    }

    @$el = $(el)
    @settings = $.extend @defaultSettings(), options
    @triggers = if @settings.triggers != null then @multiSet @settings.triggers else [$(@$el.find(':button')[0])]
    # Also keep track of elements with transitions
    @transitionHeight = if @settings.transitionHeight != null then @multiSet @settings.transitionHeight else null

    # Use multiset function to add one or more toggleable elements, and add any triggers
    @toggleable = @multiSet @settings.toggle
    @toggleable = @toggleable.concat @triggers

    @transitionSpeed = @settings.transitionSpeed

    if @transitionHeight != null then @toggleable = @toggleable.concat @transitionHeight

    # Setup burger hash (or slaw) if the selector has been passed as an option
    if @settings.hash && @$el.find(@settings.hash)
      hashKey = @util.snakeToCamel(@settings.hash.substring(6, @settings.hash.length - 1))
      @hash = @$el.find(@settings.hash).data(hashKey)
    else
      @hash = null
      console.log('A hash was set, but could not be found within the element');

    # Assign closers but only if there are any
    @closers = if @settings.closers != null then @multiSet @settings.closers else null
    @toggledClass = @settings.toggledClass
    @closedClass = if @settings.closedClass != null then @settings.closedClass else null
    @prevent = @settings.preventDefault
    # Outside is set as either a set of selectors or a boolean value
    @outside = if typeof @settings.outside != 'boolean' then @multiSet @settings.outside else @settings.outside

    # Assign callbacks from options if they are functions
    @onToggleOn = if typeof @settings.onToggleOn == 'function' then @settings.onToggleOn else () ->
    @onToggleOff = if typeof @settings.onToggleOff == 'function' then @settings.onToggleOff else () ->
    @afterHeightOff = if typeof @settings.afterHeightOff == 'function' then @settings.afterHeightOff else () ->

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
    @maybeToggleOnLoad()
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

  toggleAll: (event) ->
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
      # Run Toggle On Callback
      @onToggleOn.call(@$el)
      @bindClose()
    else
      # Run Toggle Off Callback
      @onToggleOff.call(@$el)
      @unbindClose()
      # Add closed class if it's set in the options
      if @closedClass != null
        for t in @toggleable
          t.toggleClass @closedClass

    if @transitionHeight
      for th in @transitionHeight
        if th.hasClass @toggledClass
          @transitionOpenHeight(th)
        else
          @transitionCloseHeight(th, event)

  transitionOpenHeight: (element) ->
    element.css {
      display: 'inherit',
      height: 'auto'
    }
    $openHeight = element.outerHeight()
    element.css 'height', 0
    element.animate({
      height: $openHeight
    }, @transitionSpeed, ()->
      element.css('height', 'auto')
    )

  transitionCloseHeight: (element, event) ->
    element.animate({
      height: 0
    }, @transitionSpeed, () =>
      # Run Height Off Callback
      @afterHeightOff.call(element, event))

  maybeToggleOnLoad: ->
    if @hash
      # Toggle on load if the hash has a match in the URL
      if ~location.hash.toLowerCase().indexOf(@hash)
        @toggleAll()

  bindToggle: ->
    for t in @triggers
      t.click (event) =>
        if @prevent
          if(event.preventDefault)
            event.preventDefault();
          else
            event.returnValue = false;
        @toggleAll(event)

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
      @toggleAll(e)

  bindClose: ->
    $('body').bind("mouseup touchend", (e) =>
      if @outside && @outHide(e)
        @toggleAll(e)
    )
    if @settings.touch == true
      @$el.swipe("enable")
      @$el.swipe({
        swipeLeft: (event, direction) =>
          @toggleAll(event)
      });
    if @closers != null
      for c in @closers
        c.bind("click", (event) =>
          if @prevent
            if(event.preventDefault)
              event.preventDefault();
            else
              event.returnValue = false;
          @toggleAll(event)
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
