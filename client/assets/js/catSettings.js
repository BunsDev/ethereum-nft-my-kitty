
var colors = Object.values(allColors())

var defaultDNA = {
    "headcolor" : 10,
    "tailColor" : 27,
    "pawColor" : 84,
    "eyecolor" : 21,
    //Cattributes
    "eyesShape" : 1,
    "decorationPattern" : 1,
    "decorationMidcolor" : 13,
    "decorationSidescolor" : 13,
    "animation" :  1,
    "lastNum" :  1
    }

// when page load
$( document ).ready(function() {
  defaultCat();
});

function getDna(){
    var dna = ''

    dna += $('#dnabody').html()
    dna += $('#dnatail').html()
    dna += $('#dnapaw').html()
    dna += $('#dnaeyes').html()

    dna += $('#dnashape').html()
    dna += $('#dnadecoration').html()
    dna += $('#dnadecorationMid').html()
    dna += $('#dnadecorationSides').html()
    dna += $('#dnaanimation').html()

    dna += $('#dnaspecial').html()

    return parseInt(dna)
}

function renderCat(dna){
    headColor(colors[dna.headcolor],dna.headcolor)
    $('#bodycolor').val(dna.headcolor)
    tailColor(colors[dna.tailColor],dna.tailColor)
    $('#tailcolor').val(dna.tailColor)
    pawColor(colors[dna.pawColor],dna.pawColor)
    $('#pawcolor').val(dna.pawColor)
    eyeColor(colors[dna.eyecolor],dna.eyecolor)
    $('#eyecolor').val(dna.eyecolor)

    eyeVariation(dna.eyesShape)
    $('#eyesshape').val(dna.eyesShape)
    decorationVariation(dna.decorationPattern)
    $('#decorationpattern').val(dna.decorationPattern)
    decorationMidColor(colors[dna.decorationMidcolor],dna.decorationMidcolor)
    $('#decorationmidcolor').val(dna.decorationMidcolor)
    decorationSideColor(colors[dna.decorationSidescolor],dna.decorationSidescolor)
    $('#decorationsidecolor').val(dna.decorationSidescolor)

    animationVariation(dna.animation)
    $('#animationvariation').val(dna.animation)
}

// Changing cat colors
$('#bodycolor').change(()=>{
    var colorVal = $('#bodycolor').val()
    headColor(colors[colorVal],colorVal)
});

$('#tailcolor').change(()=>{
  var colorVal = $('#tailcolor').val()
  tailColor(colors[colorVal],colorVal)
});

$('#pawcolor').change(()=>{
  var colorVal = $('#pawcolor').val()
  pawColor(colors[colorVal],colorVal)
});

$('#eyecolor').change(()=>{
  var colorVal = $('#eyecolor').val()
  eyeColor(colors[colorVal],colorVal)
});

// Changing cattributes
$('#eyesshape').change(()=>{
  var eyesShape = parseInt($('#eyesshape').val())
  eyeVariation(eyesShape)
});

$('#decorationpattern').change(()=>{
  var decorationPatten = parseInt($('#decorationpattern').val())
  decorationVariation(decorationPatten)
});

$('#decorationmidcolor').change(()=>{
  var colorVal = $('#decorationmidcolor').val()
  decorationMidColor(colors[colorVal],colorVal)
});

$('#decorationsidecolor').change(()=>{
  var colorVal = $('#decorationsidecolor').val()
  decorationSideColor(colors[colorVal],colorVal)
});

$('#animationvariation').change(()=>{
  var animationVal = parseInt($('#animationvariation').val())
  animationVariation(animationVal)
});

// Cat Buttons
function randomCat() {

  let randomDNA = {
    "headcolor" : Math.floor(Math.random() * 89) + 10,
    "tailColor" : Math.floor(Math.random() * 89) + 10,
    "pawColor" : Math.floor(Math.random() * 89) + 10,
    "eyecolor" : Math.floor(Math.random() * 89) + 10,
    //Cattributes
    "eyesShape" : Math.floor(Math.random() * 4) + 1,
    "decorationPattern" : Math.floor(Math.random() * 4) + 1,
    "decorationMidcolor" : Math.floor(Math.random() * 89) + 10,
    "decorationSidescolor" : Math.floor(Math.random() * 89) + 10,
    "animation" :  Math.floor(Math.random() * 4) + 1,
    "lastNum" :  1
    }

    renderCat(randomDNA);
}

function defaultCat() {
  $('#dnabody').html(defaultDNA.headColor);
  $('#dnatail').html(defaultDNA.tailColor);
  $('#dnapaw').html(defaultDNA.pawColor);
  $('#dnaeyes').html(defaultDNA.eyecolor);
    
  $('#dnashape').html(defaultDNA.eyesShape);
  $('#dnadecoration').html(defaultDNA.decorationPattern);
  $('#dnadecorationMid').html(defaultDNA.decorationMidcolor);
  $('#dnadecorationSides').html(defaultDNA.decorationSidescolor);
  $('#dnaanimation').html(defaultDNA.animation);

  $('#dnaspecial').html(defaultDNA.lastNum);

  renderCat(defaultDNA); 
}