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
