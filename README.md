#cic-veggieburger
####Probably vegan :hamburger:

A jQuery plug-in written in CoffeeScript for the oft-requested show/hide module, be it with the so very 2012 "Hamburger button" or some other such linkage.


## Plain Order
Ordering up a vb is as simple as you'd expect. Let's say we have a nav tag and a button we want to use to add/remove a class from the nav. Something like:
```
<button>Menu</button>
<nav>
  <ul>
    <li>
      Probably Vegan Burger
    </li>
    <li>
      Salty Fries
    </li>
    <li>
      Saurkraut Special
    </li>
  </ul>
</nav>
```

The minimum order price is a selector ([HTML5 data attributes work nice](http://html5doctor.com/html5-custom-data-attributes/)) on the element you want to toggle (in this case, the `<nav>`) and, like all-fast food orders,
a wax paper wrapper with a data-class to link up that script:

```
<div data-hamburger>
  <button>Menu</button>
  <nav data-toggle>
    <ul>
      <li>
        etc...
      </li>
  </nav>
</div>
```

In your own scripts, you'd order:

```
$('[data-hamburger]').veggieburger();
```

###:point_up:What this does
By default, veggieburger maps the toggle class functionality to the first `<button>` element it finds, and will toggle classes on any *inner* elements with the
attribute `[data-toggle]`. It also toggles the class `open` on both `$('[data-toggle]')` and the trigger (in this case button) element.

##With Saus
The veggieburger is extensible with your choice of toppings.
Right now, you can
- `trigger` Choose one or more specific elements to act as the toggle trigger
- `toggle` Choose one or more specific element for the open/close class toggle
- `toggledClass` Name the class that gets applied when the veggieburger trigger is used
- `closedClass` Add an optional "closed" class that gets applied once the veggieburger is closed, and re-applied on close ever after: This is helpful for CSS animations that you want to run on a secondary interaction, but not on the initial state
- `closers` Enable clicking on one or more separate element to close the hamburger
- `closeKeys` Trigger a "close-toggle" on one or more key presses
- `preventDefault` Enable default link behavior (if you want, preventDefault is actually the default here)
- `outside` Enable clicking outside the veggieburger/toggled element to close/hide the toggle (good for large site menus)
- `touch` Enable touch to close the menu with a swipe [(requires TouchSwipe.js library to be ordered up separately)](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin).
- `onToggleOn` Callback function that runs as when plugin toggles on (but not off)

```
$('[data-hamburger]').veggieburger({
  triggers: '[data-hamburger-switch]',  #default null (script looks for first <button> within veggieburger element)
                                        # option can be either a selector within a string (as shown) or an array of selectors (as strings)
  toggle: '[data-hamburger-toggle]',    #default [data-toggle], option can be either a selector within a string or an array of selectors
  toggledClass: 'activated',            #default 'open'
  closedClass: 'closed',                #default null
  closers: '[data-hamburger-close]',    #default null, option can be either a selector within a string or an array of selectors
  closeKeys: [27, 70]                   #default null, option can be either a single integer or an array of integers
  preventDefault: false,                #default true
  outside: true,                        #default false
  touch: true                           #default false
  onToggleOn: function(){               #default function(){};
    console.log('Toggled!')
  }
});
```

Have fun! Fix bugs. Don't eat to fast.

## Todo
- Add callbacks that can be fired when menu is opened, or closed
- Add option to make touch direction adjustable
- Add option to make show function executable by swiping (I.E. swipe from out of frame to open)
- Might be good to make an Angular directive
