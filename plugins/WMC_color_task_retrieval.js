/**
 * Working memory capacity Test "Color Task", aquisition module
 * Replication of
 * Unsworth, N., Fukuda, K., Awh, E., & Vogel, E. K. (2014).
 * Working memory and fluid intelligence: Capacity, attention control, and secondary memory retrieval. Cognitive psychology, 71, 1-26.
 * MJ
 * plugin for displaying colored circles in random color for n seconds
 **/


jsPsych.plugins['color-task-retrieval'] = (function() {

  var plugin = {};

     jsPsych.pluginAPI.registerPreload('free-sort', 'stimuli', 'image');

     plugin.info = {
       name: 'free-sort',
       description: '',
       parameters: {
         stimulus_height: {
           type: [jsPsych.plugins.parameterType.INT],
           default: 800,
           no_function: false,
           description: ''
         },
         stimulus_width: {
           type: [jsPsych.plugins.parameterType.INT],
           default: 800,
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
       trial.stimulus_width = trial.stimulus_width || 150;
       trial.stimulus_height = trial.stimulus_height || 150;



       // if any trial variables are functions
       // this evaluates the function and replaces
       // it with the output of the function
       trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

       var start_time = (new Date()).getTime();

           var end_trial = function() {
                 // kill any remaining setTimeout handlers
                 jsPsych.pluginAPI.clearAllTimeouts();
       /*
                 // kill keyboard listeners
                 if (typeof keyboardListener !== 'undefined') {
                   jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                 }
       */
                 // clear the display
                 display_element.innerHTML = '';
                 // move on to the next trial
                 jsPsych.finishTrial(trial_data);
               };


       // check if there is a prompt and if it is shown above
       if (trial.prompt && trial.prompt_location == "above") {
         display_element.innerHTML += trial.prompt;
       }


       // Farben aus "acquisition"-Teil
       var values = jsPsych.data.get().values();
       var last_colors = values[0].circle_color;

       // welcher Kreis wird das target?
      var circle_num = [0,1,2,3,4,5];
      var circle_num_rand = jsPsych.randomization.repeat(circle_num, 1);
      console.log("random circle number: " + circle_num_rand);

      for (i = 0; i < 6; i++){
        if (i == circle_num_rand[0]){
          var probe_pos = i;

          display_element.innerHTML += '<div ' +
           'id="jspsych-free-sort-arena" '+
           'class="jspsych-free-sort-arena" '+
           'style="position: relative; width:'+trial.stimulus_width+'px; height:'+trial.stimulus_height+'px; border:15px solid DarkGray '+'; border-radius: 300px;background-color:white;float:left;margin:5px;";"'+
           '></div>';




        } else {
          display_element.innerHTML += '<div '+
          'id="jspsych-free-sort-arena" '+
          'class="jspsych-free-sort-arena" '+
          'style="position: relative; width:'+trial.stimulus_width+'px; height:'+trial.stimulus_height+'px; border:15px solid '+last_colors[i]+'; border-radius: 300px;background-color:white;float:left;margin:5px;";"'+
          '></div>';

        }};


        var x_coords_probe= [150,
                            340,
                            530,
                            720,
                            910,
                            1100
                            ];

        var y_coords_probe = [ 370,
                            370,
                            370,
                            370,
                            370,
                            370
                            ];

         display_element.innerHTML += '<div '+
          'style="position: absolute; left:' + x_coords_probe[probe_pos] + 'px'+
          ';top: '+y_coords_probe[probe_pos]+'px'+';"'+'>' +
          '<input id="color1" name="color1"' +
              '/></div>';

              jQuery(document).ready(function($) {

                $('#color1').colorPicker({showHexField: false,

              //  top: (trial.stim_height / 2) + 15 +'px',
              //   left:
                });
              //  $('#color1').offset().top(y_coords_probe[probe_pos] + 'px');
              //  $('#color1').offset().left(x_coords_probe[probe_pos]+ 'px');
                $("#color1").change();
});

       // check if prompt exists and if it is shown below
       if (trial.prompt && trial.prompt_location == "below") {
         display_element.innerHTML += trial.prompt;
       }

       display_element.innerHTML += '<button id="jspsych-free-sort-done-btn" class="jspsych-btn" style="position:absolut;bottom:10;">fertig</button>';
       display_element.querySelector('#jspsych-free-sort-done-btn').addEventListener('click', function(){

         var end_time = (new Date()).getTime();
         var rt = end_time - start_time;
         // gather data
         // get final position of all objects


         // advance to next part
         display_element.innerHTML = '';
         jsPsych.finishTrial(trial_data);

      var trial_data = {

      };
      console.log("chosen " + dd);

       if (trial.timing_response > 0) {
         jsPsych.pluginAPI.setTimeout(function() {
           end_trial(trial_data);
         }, trial.timing_response);
       };
     });


}
     return plugin;
   })();
