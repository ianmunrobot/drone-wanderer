/* global nx Tone */

var NODES = 32;

Tone.Master.volume.value = -Infinity;
var oscillators = {};
var fundamental = 32;



// wait for load to turn on volume
window.setTimeout(function() {
  Tone.Master.volume.value = -20;
}, 200)


nx.onload = function() {
  makeOscillators('sine');

  var jointsArray = Array(NODES).fill(0).map(a => {
    return {
      x: Math.random(),
      y: Math.random()
    }
  });

  // set box height
  var $container = $('#joints-holder');
  console.log($(window).height());
  $container.height($(window).height() - 50);

  // set navbar height
  // var $navbar = $('#options-navbar');
  // $navbar.height($(window).height() * .07)

  // formatting div
  nx.colorize('accent', '#0ea046');
  nx.colorize('fill', '#2d2d2d');


  // joints initial value
  joints1.val.x = Math.random();
  joints1.val.y = Math.random();
  joints1.resize($container.width(), $container.height());
  joints1.animate('bounce');
  joints1.joints = jointsArray;
  joints1.init();
  joints1.threshold = Math.max($('#joints-holder').width() / 1.5, 450);
  joints1.nodeSize = 30;
  joints1.draw();

  $(window).on("resize", function() {
    $container.height($(window).height() * .93);
    joints1.resize($container.width(), $container.height());
    joints1.nodeSize = 30;
    joints1.threshold = Math.max($('#joints-holder').width() / 1.5, 450);
    joints1.draw();
  })

  joints1.on('*', setValues);

  // animate
  window.setInterval(function() {
    var oldAniX = joints1.anix;
    var oldAniY = joints1.aniy;
    var newAniX = oldAniX + (Math.random() / 500) - .001;
    var newAniY = oldAniY + (Math.random() / 500) - .001;
    joints1.anix = newAniX;
    joints1.aniy = newAniY
  }, 300);

  $('button').on('focus', function() {
    $(this).blur();
    $('button').removeClass('active');
    $(this).addClass('active');

    for (var osc in oscillators) {
      oscillators[osc].type = this.id;
    }
  })
}

// generate oscillators of set type w/random pan
function makeOscillators(type) {
  for (var i = 1; i <= NODES; i++) {
    var panner = new Tone.Panner(Math.random() * 1 - .5).toMaster();
    var reverb = new Tone.JCReverb(0.7).connect(panner)
    oscillators['node' + i] = new Tone.FMOscillator({
      frequency: fundamental * i,
      type: type,
      modulationType: "sine",
      harmonicity: 1,
      modulationIndex: 1.5,
      volume: -Infinity
    }).connect(reverb).start();
  }
}

// recalculate amplitudes
function setValues(data) {
    for (var partial in oscillators) {
      if (data.hasOwnProperty(partial)) {
        var num = partial.slice(4);
        oscillators[partial].volume.rampTo((1 - (Math.pow(data[partial], 0.5) * ((NODES - num) / NODES) )) * -60, 0.3);
      } else {
        oscillators[partial].volume.rampTo(-Infinity, 0.4);
      }
    }
  }
