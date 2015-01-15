#cic-veggieburger
####Probably vegan :hamburger:

A jQuery plug-in written in CoffeeScript for the oft-requested show/hide module, be it with the so very 2012 "Hamburger button" or some other such linkage.


## Plain Order
Ordering up a vb is as simple as you'd expect. Let's say we have a menu-button with the [HTML5 data attribute](http://html5doctor.com/html5-custom-data-attributes/): "data-hamburger" I.E. `<button class="three-lines" data-hamburger>`
You'd order:

```
$('[data-hamburger]').veggieburger();
```

###:point_up:What this does
By default, veggieburger maps the show/hide toggle functionality to any element with the HTML5 data attribute `data-toggle`: when clicked, it toggles the class `open` on both `$('[data-toggle]')` and the element executing the veggieburger.

##With Saus
The veggieburger is extensible with your choice of toppings.
Right now, you can
- Choose a specific element for the show/hide toggle
- Name the class that gets applied when veggieburger is launched
- Add an optional "closed" class that gets applied once the veggieburger is closed, and re-applied on close ever after: This is helpful for CSS animations that you want to run on a secondary interaction, but not on the initial state
- Enable default link behavior (if you want, preventDefault is actually the default here)
- Enable clicking outside the veggieburger/toggled element to close/hide the toggle (good for large site menus)
- Enable clicking on a separate element to close the hamburger
- Enable touch to close the menu with a swipe [(requires TouchSwipe.js library to be ordered up separately)](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin).

```
$('[data-hamburger-menu]').veggieburger({
  toggle: '[data-hamburger-toggle]',    #default [data-toggle]
  toggledClass: 'activated',            #default 'open'
  closedClass: 'closed',                #default null
  closer: '[data-hamburger-close]',     #default null
  preventDefault: false,                #default true
  outside: true,                        #default false
  touch: true                           #default false
});
```

Have fun! Fix bugs. Don't eat to fast.

## Todo
- Add option for multiple toggles, closers
- Add option to make touch direction adjustable
- Add option to make show function executable by swiping (I.E. swipe from out of frame to open)
- Might be good to make an Angular directive
