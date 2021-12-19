
//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

function genColors(){
    var colors = []
    for(var i = 10; i < 99; i ++){
      var color = getColor()
      colors[i] = color
    }
    return colors
}

// Color Update Functions
function headColor(color,code) {
    $('#face, .body').css('background', '#' + color)  //This changes the color of the cat
    $('#headcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function tailColor(color,code) {
    $('.tail, .ear').css('background', '#' + color)
    $('#tailcode').html('code: '+code)
    $('#dnatail').html(code)
}

function pawColor(color,code) {
    $('.paw, .inner_ears, .nose').css('background', '#' + color)
    $('#pawcode').html('code: '+code)
    $('#dnapaw').html(code)
}

function eyeColor(color,code) {
    $('.pupils, .whisker, .mouth').css('background', '#' + color)
    $('#eyecode').html('code: '+code)
    $('#dnaeyes').html(code)
}


// Cattributes Funtions
function eyeVariation(num) {

    $('#dnashape').html(num)
    switch (num) {
        case 1:
            $('#eyesshapecode').html('Basic')
            normalEyes()
            break
        case 2:
            normalEyes()
            $('#eyesshapecode').html('Wide')
            wideEyes()
            break
        case 3:
            normalEyes()
            $('#eyesshapecode').html('Snake')
            snakeEyes()
            break
        case 4:
            normalEyes()
            $('#eyesshapecode').html('Half Moon')
            halfMoonEyes()
            break          
        default:
            $('#eyesshapecode').html('Basic')
            normalEyes()
            break
    }
}

function decorationVariation(num) {

    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#decorationcode').html('Basic')
            normalDecoration()
            break
        case 2:
            normalDecoration()
            $('#decorationcode').html('Spread')
            spreadDecoration()
            break
        case 3:
            normalDecoration()
            $('#decorationcode').html('V Shape')
            vShapeDecoration()
            break
        case 4:
            normalDecoration()
            $('#decorationcode').html('Dots')
            dotsDecoration()
            break          
        default:
            $('#decorationcode').html('Basic')
            normalDecoration()
            break
    }
}

function animationVariation(num) {

    $('#dnaanimation').html(num)
    switch (num) {
        case 1:
            resetAnimation()
            $('#animationcode').html('Moving Head')
            movingHeadAnimation()
            break
        case 2:
            resetAnimation()
            $('#animationcode').html('Wandering Eyes')
            wanderingEyesAnimation()
            break
        case 3:
            resetAnimation()
            $('#animationcode').html('Wiggling Tail')
            wigglingTailAnimation()
            break
        case 4:
            resetAnimation()
            $('#animationcode').html('Jumping Paws')
            jumpingPawsAnimation()
            break          
        default:
            resetAnimation()
            $('#animationcode').html('Moving Head')
            movingHeadAnimation()
            break
    }
}

function decorationMidColor(color,code) {
    $('.forehead_marker_mid').css('background', '#' + color)
    $('#decorationmidcode').html('code: '+code)
    $('#dnadecorationMid').html(code)
}

function decorationSideColor(color,code) {
    $('.forehead_marker_left, .forehead_marker_right').css('background', '#' + color)
    $('#decorationsidecode').html('code: '+code)
    $('#dnadecorationSides').html(code)
}

async function normalEyes() {
    await $('.pupils').css({"width": "28px", "height": "35px", "border-radius": "50% 50% 50% 50%", "transform": "rotate(0deg)", "top": "10px", "left": "12px"});
}

async function wideEyes() {
    await $('.pupils').css({"width": "30px", "height": "35px", "border-radius": "0% 100% 0% 100%", "transform": "rotate(-50deg)", "top": "10px", "left": "10px"});
}

async function snakeEyes() {
    await $('.pupils').css({"width": "10px", "height": "44px", "border-radius": "0% 100% 0% 100%", "transform": "rotate(7deg)", "top": "3px", "left": "20px"});
}

async function halfMoonEyes() {
    await $('.pupils').css({"width": "28px", "height": "25px", "border-radius": "100% 100% 20% 20%", "top": "13px", "left": "12px"});
}

async function normalDecoration() {
    //Reset all decoration style
    $('.forehead_marker_mid').css({"width": "10px", "height": "30px", "border-radius": "50% 50% 50% 50%", "left": "0px", "transform": "none"})
    $('.forehead_marker_left').css({"width": "10px", "height": "20px", "border-radius": "50% 50% 50% 50%", "left": "-15px", "transform": "none"})
    $('.forehead_marker_right').css({"width": "10px", "height": "20px", "border-radius": "50% 50% 50% 50%", "left": "15px", "transform": "none"})
}

async function spreadDecoration() {
    $('.forehead_marker_mid').css({"width": "10px", "height": "30px", "border-radius": "50% 50% 50% 50%", "left": "0px"})
    $('.forehead_marker_left').css({"width": "10px", "height": "20px", "border-radius": "50% 50% 50% 50%", "left": "-15px", "transform": "rotate(45deg)"})
    $('.forehead_marker_right').css({"width": "10px", "height": "20px", "border-radius": "50% 50% 50% 50%", "left": "15px", "transform": "rotate(-45deg)"})
}

async function vShapeDecoration() {
    $('.forehead_marker_mid').css({"width": "10px", "height": "20px", "border-radius": "50% 50% 50% 50%", "left": "0px"})
    $('.forehead_marker_left').css({"width": "10px", "height": "40px", "border-radius": "50% 50% 50% 50%", "left": "-15px", "transform": "rotate(-20deg)"})
    $('.forehead_marker_right').css({"width": "10px", "height": "40px", "border-radius": "50% 50% 50% 50%", "left": "15px", "transform": "rotate(20deg)"})
}

async function dotsDecoration() {
    $('.forehead_marker_mid').css({"width": "10px", "height": "10px", "border-radius": "50% 50% 50% 50%", "left": "0px"})
    $('.forehead_marker_left').css({"width": "10px", "height": "10px", "border-radius": "50% 50% 50% 50%", "left": "-15px"})
    $('.forehead_marker_right').css({"width": "10px", "height": "10px", "border-radius": "50% 50% 50% 50%", "left": "15px"})
}

async function resetAnimation() {
    $('#face').removeClass('movingHead');
    $('.ear_left').removeClass('movingEarLeft');
    $('.ear_right').removeClass('movingEarRight');
    $('.pupils').removeClass('wanderingEyes');
    $('.tail').removeClass('wigglingTail');
    $('.paws').removeClass('jumpingPaws');
}

async function movingHeadAnimation() {
    $('#face').addClass('movingHead');
    $('.ear_left').addClass('movingEarLeft');
    $('.ear_right').addClass('movingEarRight');
}

async function wanderingEyesAnimation() {
    $('.pupils').addClass('wanderingEyes');
}

async function wigglingTailAnimation() {
    $('.tail').addClass('wigglingTail');
}

async function jumpingPawsAnimation() {
    $('.paws').addClass('jumpingPaws');
}