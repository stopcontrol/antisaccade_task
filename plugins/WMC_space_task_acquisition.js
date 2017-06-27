/**
 * Working memory capacity Test, aquisition module
 * Replication of
 * Unsworth, N., Fukuda, K., Awh, E., & Vogel, E. K. (2014).
 * Working memory and fluid intelligence: Capacity, attention control, and secondary memory retrieval. Cognitive psychology, 71, 1-26.
 * MJ
 * plugin for displaying concentric stimuli in random spatial order for n Seconds
 **/


jsPsych.plugins['space-task-aquisition'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('free-sort', 'stimuli', 'image');

  plugin.info = {
    name: 'free-sort',
    description: '',
    parameters: {
      stimuli: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        array: true,
        no_function: false,
        description: ''
      },
      stim_height: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 100,
        no_function: false,
        description: ''
      },
      stim_width: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 100,
        no_function: false,
        description: ''
      },
      sort_area_height: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 1000,
        no_function: false,
        description: ''
      },
      sort_area_width: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 1000,
        no_function: false,
        description: ''
      },
      prompt: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: '',
        no_function: false,
        description: ''
      },
      timing_stim: {
        type: [jsPsych.plugins.parameterType.INT],
        default: -1,
        no_function: false,
        description: ''
      },
      prompt_location: {
        type: [jsPsych.plugins.parameterType.SELECT],
        options: ['above','below'],
        default: 'above',
        no_function: false,
        description: ''
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    // default values
    trial.stim_height = trial.stim_height || 100;
    trial.stim_width = trial.stim_width || 100;
    trial.prompt = (typeof trial.prompt === 'undefined') ? '' : trial.prompt;
    trial.prompt_location = trial.prompt_location || "above";
    trial.sort_area_width = trial.sort_area_width || 600;
    trial.sort_area_height = trial.sort_area_height || 600;
    trial.timing_stim = trial.timing_stim || -1;

    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    var start_time = (new Date()).getTime();

    // check if there is a prompt and if it is shown above
   if (trial.prompt && trial.prompt_location == "above") {
      display_element.innerHTML += trial.prompt;
    }

    // Definiere Trial-Ende
    var end_trial = function() {
          // kill any remaining setTimeout handlers
          jsPsych.pluginAPI.clearAllTimeouts();

          // clear the display
          display_element.innerHTML = '';

          // move on to the next trial
          jsPsych.finishTrial(trial_data);
        };

        // Kreisring
    display_element.innerHTML += '<div '+
      'id="jspsych-free-sort-arena" '+
      'class="jspsych-free-sort-arena" '+
      'style="position: relative; width:'+trial.sort_area_width+'px; height:'+trial.sort_area_height+'px; border:0px solid #444;margin:1em; border-radius: 300px;"'+
      '></div>';

      //Koordinaten für Stimulipräsentaion
    var x_center = (trial.sort_area_width / 2 - trial.stim_width / 2);
    var y_center = (trial.sort_area_height / 2 - trial.stim_height / 2);
    //console.log('arena_width: ' + trial.sort_area_width);

    var x_start_locations = [ x_center ,
                            465,
                            440,
                            252,
                            40,
                            40
                          ];

    var y_start_locations = [  0 ,
                              143,
                              399,
                              491,
                              392,
                              128
                            ];

    var init_locations = [];
    var stimuli_row = {a:0, b:1, c:2, d:3, e:4, f:5};
    console.log(stimuli_row);
    window.glob = jsPsych.randomization.repeat(stimuli, 1);
    var rand = window.glob;
    console.log("random. Reihenfolge 'acquisition': " + rand)

    // Ordne Stimuli anhand der Koordinaten konzentrisch an
    for (var i = 0; i < trial.stimuli.length; i++) {
      for (var j = 0; i < trial.stimuli.length; j++) {
      coords = {
        x: x_start_locations[i],
        y: y_start_locations[i]
      };
      i = i + 1;

      display_element.querySelector("#jspsych-free-sort-arena").innerHTML += '<img '+
        'src="'+rand[j]+'" '+
        'data-src="'+rand[j]+'" '+
        'class="jspsych-free-sort-draggable" '+
        'draggable="false" '+
        'style="position: absolute; cursor: move; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+coords.y+'px; left:'+coords.x+'px;">'+
        '</img>';

      init_locations.push({
        "src": trial.stimuli[rand[j]],
        "x": coords.x,
        "y": coords.y
      });
    }}

    display_element.innerHTML += '<button id="jspsych-free-sort-done-btn" class="jspsych-btn-placeholder" style="color:black"></button>';

      var end_time = (new Date()).getTime();
      var rt = end_time - start_time;

      var trial_data = {
        "rand_stimulus": trial.stimuli
      };

      // advance to next part
    if (trial.timing_response > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.timing_response);
    }
  };

  return plugin;
})();
