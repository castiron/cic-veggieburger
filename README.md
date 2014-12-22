#cic-veggieburger
####Probably vegan :hamburger:

A jQuery plug-in written in CoffeeScript for the oft-requested show/hide module, be it with the so very 2012 "Hamburger button" or some other such linkage.


## Plain Order
Ordering up a vb is as simple as you'd expect. Let's say we have a menu with the [HTML5 data attribute](http://html5doctor.com/html5-custom-data-attributes/): "data-hamburger-menu" I.E. `<nav class="menu" data-hamburger-menu>`
You'd order:

```
$('[data-hamburger-menu]').veggieburger();
```

###:point_up:What this does
By default, veggieburger maps the show/hide toggle functionality to an element with the HTML5 data attribute `data-toggle`: when clicked, it toggles the class `open` on both the toggle and the element executing the veggieburger.
By default, you can also activate the "hide" function by clicking outside the executing element.

##With Saus
The veggieburger is lightly extensible with some choice in toppings.
Right now, you can
- Choose a specific element for the show/hide toggle
- Name the class that gets applied when veggieburger is launched
- Enable clicking outside the veggieburger/toggled element to close/hide the toggle (good for large site menus)
- Enable touch to close the menu with a swipe [(requires TouchSwipe.js library to be ordered up separately)](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin).

```
$('[data-hamburger-menu]').veggieburger({
  toggle: '[data-hamburger-toggle]',    #default [data-toggle]
  toggledClass: 'activated',            #default 'open'
  outside: true,                        #default false
  touch: true                           #default false
});
```

Have fun! Fix bugs. Don't eat to fast.

## Todo
- Add option for multiple toggles
- Add option to make touch direction adjustable
- Add option to make show function executable by swiping (I.E. swipe from out of frame to open)
- Might be good to make an Angular directive
