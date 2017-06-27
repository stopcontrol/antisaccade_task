
jsPsych.plugins['vsl-animate-occlusion'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('vsl-animate-occlusion', 'stimuli', 'image');

  plugin.info = {
    name: 'vsl-animate-occlusion',
    description: '',
    parameters: {
      stimuli: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        array: true,
        no_function: false,
        description: ''
      },
      choices: {
        type: [jsPsych.plugins.parameterType.KEYCODE],
        array: true,
        default: jsPsych.ALL_KEYS,
        no_function: false,
        description: ''
      },
      canvas_size: {
        type: [jsPsych.plugins.parameterType.INT],
        array: true,
        default: [1000,1000],
        no_function: false,
        description: ''
      },
      image_size: {
        type: [jsPsych.plugins.parameterType.INT],
        array: true,
        default: [100,100],
        no_function: false,
        description: ''
      },
      initial_direction: {
        type: [jsPsych.plugins.parameterType.SELECT],
        choices: ['left','right'],
        default: 'left',
        no_function: false,
        description: ''
      },
      occlude_center: {
        type: [jsPsych.plugins.parameterType.BOOL],
        default: true,
        no_function: false,
        description: ''
      },
      timing_cycle: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 1000,
        no_function: false,
        description: ''
      },
      timing_pre_movement: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 500,
        no_function: false,
        description: ''
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // default trial parameters
    trial.timing_cycle = trial.timing_cycle || 1000;
    trial.canvas_size = trial.canvas_size || [1000, 1000];
    trial.image_size = trial.image_size || [100, 100];
    trial.initial_direction = trial.initial_direction || "left";
    trial.occlude_center = (typeof trial.occlude_center === 'undefined') ? true : trial.occlude_center;
    trial.choices = trial.choices || jsPsych.ALL_KEYS;
    trial.timing_pre_movement = (typeof trial.timing_pre_movement === 'undefined') ? 500 : trial.timing_pre_movement;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // variable to keep track of timing info and responses
    var start_time = 0;
    var responses = [];
    var directions = [trial.canvas_size[0] / 2 - trial.image_size[0] / 2 - 200, trial.canvas_size[0] / 2 - trial.image_size[0] / 2 + 200]

    var which_letter = jsPsych.randomization.repeat(trial.stimuli, 12);
    var letter_number = 0;
    var arrows = ["/Users/marcel/Dropbox/OMFix/Studie3/Tests\ &\ Tasks\ Study\ 3/img/arrow_left.png", "/Users/marcel/Dropbox/OMFix/Studie3/Tests\ \&\ Tasks\ Study\ 3/img/arrow_right.png"];

    console.log("letter: " + which_letter);
/////////////////////////////////////////////////////////////////////////


    var new_direction = Math.round(Math.random());
    console.log("new_direction: " + new_direction);

    function primer() {
      if (trial.stimuli.length == which_letter.length){
        endTrial();
      } else {

        var next_direction = new_direction;//(trial.initial_direction == "right") ? 0 : 1;

        //var d = directions[next_direction];
        //next_direction === 0 ? next_direction = 1 : next_direction = 0;
      //  var i = which_letter[letter_number];

        var primer_img = paper.image(arrows[next_direction], directions[next_direction], (trial.canvas_size[1] / 2) - trial.image_size[0]/2, trial.image_size[0], trial.image_size[1]).attr({
          "id": 'jspsych-vsl-animate-occlusion-moving-image'
        });
      }


    //}

    //  function show_target() {

        //letter_number++;
        // start timer for this trial
        start_time = (new Date()).getTime();
      }
      function target() {
        //      var next_direction = new_direction;
        var next_direction = new_direction;//(trial.initial_direction == "right") ? 0 : 1;

              var target = paper.image(which_letter[letter_number], directions[next_direction], (trial.canvas_size[1] / 2) - trial.image_size[0]/2, trial.image_size[0], trial.image_size[1]).attr({
                  "id": 'jspsych-vsl-animate-occlusion-canvas'
                });
              }

    display_element.innerHTML += "<svg id='jspsych-vsl-animate-occlusion-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>";

    var paper = Snap("#jspsych-vsl-animate-occlusion-canvas");
    //var prime = Snap("#jspsych-vsl-animate-occlusion-canvas");

  /*  var left = paper.image(arrows[0], directions[next_direction], (trial.canvas_size[1] / 2) - trial.image_size[0]/2, trial.image_size[0], trial.image_size[1]).attr({
      "id": 'jspsych-vsl-animate-occlusion-moving-image'
    }); */

  /*  var right = paper.image(arrows[1], trial.canvas_size[0] / 2 - trial.image_size[0] / 2, trial.canvas_size[1] / 2 - trial.image_size[1] / 2, trial.image_size[0], trial.image_size[1]).attr({
      "id": 'jspsych-vsl-animate-occlusion-moving-image'
    }); */

  //  display_element.querySelector('#jspsych-vsl-animate-occlusion-moving-image').removeAttribute('preserveAspectRatio');

    if (trial.occlude_center) {
    //  paper.rect(trial.canvas_size[0] / 2 - 700/2, trial.canvas_size[0] / 2 - 500/2, 700, 500)
      paper.image("img/fix.png",trial.canvas_size[0] / 2 - 360/2, trial.canvas_size[0] / 2 - 225/2, 360,225, trial.canvas_size[1]).attr({
        fill: "#000"
      });
    }
    console.log("dir.: " + directions)

    // add key listener
    var after_response = function(info) {
      responses.push({
        key: info.key,
        stimulus: letter_number - 1,//which_image - 1,
        rt: info.rt
      });
    }

    key_listener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'date',
      persist: true,
      allow_held_key: false
    });
          //primer();
          //jsPsych.pluginAPI.setTimeout(show_target(), 10000);

   if (trial.timing_pre_movement > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        primer();
        target();

      //  show_target();

      //  show_target();
      }, trial.timing_pre_movement);
    } else {
      primer();

    //  show_target();
    //  setTimeout('show_target()', 1000);
    }


    function endTrial() {

      display_element.innerHTML = '';

      jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

      var trial_data = {
        "stimuli": JSON.stringify(trial.stimuli),
        "responses": JSON.stringify(responses)
      };

      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
