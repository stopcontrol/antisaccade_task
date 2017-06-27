/**
 * Working memory capacity Test: Color Task, retrieval module
 * Replication of
 * Unsworth, N., Fukuda, K., Awh, E., & Vogel, E. K. (2014).
 * Working memory and fluid intelligence: Capacity, attention control, and secondary memory retrieval. Cognitive psychology, 71, 1-26.
 * MJ
 * plugin for displaying concentric stimuli in random spatial order for n Seconds
 **/


 jsPsych.plugins['color-task-acquisition'] = (function() {

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


               // kill keyboard listeners
               if (typeof keyboardListener !== 'undefined') {
                 jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
               }

               // clear the display
               display_element.innerHTML = '';

               // move on to the next trial
               jsPsych.finishTrial(trial_data);
             };


     // check if there is a prompt and if it is shown above
     if (trial.prompt && trial.prompt_location == "above") {
       display_element.innerHTML += trial.prompt;
     }

     var colors = colorspace;
     var random_colors = jsPsych.randomization.repeat(colors, 1)
     console.log(random_colors);
     var circle_color = random_colors.slice(0,6);
     console.log("circle_color: " + circle_color);

     for (i = 0; i < 6; i++){
     display_element.innerHTML += '<div '+
       'id="jspsych-free-sort-arena" '+
       'class="jspsych-free-sort-arena" '+
       'style="position: relative; width:'+trial.stimulus_width+'px; height:'+trial.stimulus_height+'px; border:15px solid '+random_colors[i]+'; border-radius: 300px;background-color:white;float:left;margin:5px;";"'+
       '></div>';
    }

     // check if prompt exists and if it is shown below
     if (trial.prompt && trial.prompt_location == "below") {
       display_element.innerHTML += trial.prompt;
     }

    var trial_data = {
        circle_color
    };
    if (trial.timing_response > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.timing_response);
    }
  };

   return plugin;
 })();
