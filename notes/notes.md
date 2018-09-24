# SJT-Web re-implementaton

## Visuals

There's a convenient way to schedule the whole thing in Two.js's `update` function.

## Sound

Going to try and use Tone.js

https://tonejs.github.io/

Tone.js works like this:

```
//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster()

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease('C4', '8n')
```

MIDI notes can be specified with:

```
Tone.frequency(38,"midi")
```

What we want to do is map the SJT values onto something like a scale/arpeggio and have it be iterated over.

### Color Scheme

There's a selection of color schemes here http://blog.visme.co/website-color-schemes/

The color scheme that I am going to select is `40: Modern and Minimalist:`

The reason is that it gives a strong black background and four highlight colours which can be very useful for dictating the four SJT loops.

Base, black: #19181A
Forest Green: #479761
Pale yellow: #CEBC81
Purple: #A1E83
off-grey: #B19F9E


Highlights:
[#479761, #CEBC81, #A16E83, #B19F9E]
Background:
#19181A

RGBA colours, for background opacity:
[rgba(71, 151, 97, 0.5), rgba(206, 188, 129, 0.5), rgba(161, 110, 131, 0.5), rgba(177, 159, 158, 0.5) ]

### Buttons

Buttons taken from here: https://fdossena.com/?p=html5cool/buttons/i.frag
I had to retype all of the CSS to get it to work, for some reason.

### Range sliders:

Attempted to use `react-rangesldier`

https://github.com/whoisandy/react-rangeslider

Not so much luck, didn't look great either.

Attempted to use react-input-range

### Scales

attempted to use:

https://github.com/danigb/tonal
