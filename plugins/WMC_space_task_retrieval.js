/**
 * Working memory capacity Test
 * Replication of
 * Unsworth, N., Fukuda, K., Awh, E., & Vogel, E. K. (2014).
 * Working memory and fluid intelligence: Capacity, attention control, and secondary memory retrieval. Cognitive psychology, 71, 1-26.
 * MJ
 * plugin for displaying concentric stimuli in random spatial order for n Seconds
 **/


 jsPsych.plugins['space-task-retrieval'] = (function() {

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
         default: 800,
         no_function: false,
         description: ''
       },
       sort_area_width: {
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
     trial.prompt = (typeof trial.prompt == 'undefined') ? '' : trial.prompt;
     trial.prompt_location = trial.prompt_location || "above";
     trial.sort_area_width = trial.sort_area_width || 600;
     trial.sort_area_height = trial.sort_area_height || 600;

     // if any trial variables are functions
     // this evaluates the function and replaces
     // it with the output of the function
     trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

     var start_time = (new Date()).getTime();

     // check if there is a prompt and if it is shown above
     if (trial.prompt && trial.prompt_location == "above") {
       display_element.innerHTML += trial.prompt;
     }

     display_element.innerHTML += '<div '+
       'id="jspsych-free-sort-arena" '+
       'class="jspsych-free-sort-arena" '+
       'style="position: relative; width:'+trial.sort_area_width+'px; height:'+trial.sort_area_height+'px; border:15px solid #444; border-radius: 300px;background-color:white"'+
       '></div>';

     // check if prompt exists and if it is shown below
     if (trial.prompt && trial.prompt_location == "below") {
       display_element.innerHTML += trial.prompt;
     }

     // store initial location data
     var button_locations = [];
     var x_center = (trial.sort_area_width / 2 - trial.stim_width / 2);
     var y_center = (trial.sort_area_height/ 2 - trial.stim_height / 2);

     var x_button_locations = [x_center,
                              465,
                              440,
                              250,
                              65,
                              35];

      var y_button_locations = [5 ,
                              143,
                              389,
                              497,
                              389,
                              143];

      // Wähle zufälligen Stimulus aus
      var random_retrieval = jsPsych.randomization.repeat(stimuli, 1);
      console.log("zufälliger Stimulus: " + random_retrieval[0]);

      var right_button = [];
      var probe_stimuli = window.glob;
      //var counter_right = window.glob;
      for (i in probe_stimuli){
        //console.log("i : " + i);
        //  console.log("Probe : " + probe_stimuli[i]);

      // Suche zufälligen Stimulus (Probe) im randomisierten Stimulusarray
      // um zu bestimmen, welcher Button der richtige ist
      if (probe_stimuli[i] == random_retrieval[0]){
        button = i;
        //console.log("BUTTON: " + button);
        right_button.push(button);
        break;
      }}

      console.log("right_button " + right_button);

      // zeige zufälligen Stimulus (Probe) im Kreis
      display_element.querySelector("#jspsych-free-sort-arena").innerHTML += '<img '+
         'src="'+random_retrieval[0]+'" '+
         'data-src="'+random_retrieval[0]+'" '+
         'class="jspsych-free-sort-draggable" '+
         'draggable="false" '+
         'style="position: absolute; cursor: move; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+x_center+'px; left:'+y_center+'px;">'+
         '</img>';


      //zeige answer-buttons im Kreis
      for (var i = 0; i < 6; i++) {
         display_element.querySelector("#jspsych-free-sort-arena").innerHTML += '<button id="jspsych-free-sort-done-btn'+i+'" class="jspsych-btn-answer" style="position: absolute; cursor: move; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+y_button_locations[i]+'px; left:'+x_button_locations[i]+'px;">fertig</button>';
      };

       button_locations.push({
         "src": random_retrieval[0],
         "Button-number": i,
         "x": x_button_locations,
         "y": y_button_locations
       });

      //button 0
      display_element.querySelector('#jspsych-free-sort-done-btn0').addEventListener('click', function(){
       var end_time = (new Date()).getTime();
       var rt = end_time - start_time;
       var trial_data = {
           "expected": trial.stimuli[random_retrieval[0]],
           "stimuli_number": right_button,
           "button_selection": JSON.stringify(0),
           "rt": rt,
           "Buttonnumber": 0,
           "trial_num": counter_loop,


       };
       if (right_button == trial_data.Buttonnumber){
         console.log(trial_data.Buttonnumber);
         counter_right++;
         trial_data["correct"] = true;

       }
       else {
         console.log(trial_data.Buttonnumber);
         trial_data["correct"] = false;
    //     alert("Leider falsch, am besten du versuchst es nochmal! Um das Training zu beenden ben\u00f6tigst Du 5 richtige Antworten");
       }
       // advance to next part
       display_element.innerHTML = '';
       jsPsych.finishTrial(trial_data);
     });


      //button 1
    display_element.querySelector('#jspsych-free-sort-done-btn1').addEventListener('click', function(){
        var end_time = (new Date()).getTime();
        var rt = end_time - start_time;
        var trial_data = {
              "expected": right_button,
              "button_selection": JSON.stringify(1),
              "rt": rt,
              "Buttonnumber": 1,
              "trial_num": counter_loop
          };
          if (right_button == trial_data.Buttonnumber){
            console.log(trial_data.Buttonnumber);
            counter_right++;
            trial_data["correct"] = true;

          }
          else {
            console.log(trial_data.Buttonnumber);
            trial_data["correct"] = false;
          //  alert("Leider falsch, am besten du versuchst es nochmal! Um das Training zu beenden ben\u00f6tigst Du 5 richtige Antworten");
          }
            // advance to next part
            display_element.innerHTML = '';
            jsPsych.finishTrial(trial_data);
          });

      //button 2
      display_element.querySelector('#jspsych-free-sort-done-btn2').addEventListener('click', function(){
          var end_time = (new Date()).getTime();
          var rt = end_time - start_time;
          var trial_data = {
                "expected": right_button,
                "button_selection": JSON.stringify(2),
                "rt": rt,
                "Buttonnumber": 2,
                "trial_num": counter_loop
          };
          if (right_button == trial_data.Buttonnumber){
            console.log(trial_data.Buttonnumber);
            counter_right++;
            trial_data["correct"] = true;

          }
          else {
            console.log(trial_data.Buttonnumber);
            trial_data["correct"] = false;
          //  alert("Leider falsch, am besten du versuchst es nochmal! Um das Training zu beenden ben\u00f6tigst Du 5 richtige Antworten");
          }
          // advance to next part
            display_element.innerHTML = '';
            jsPsych.finishTrial(trial_data);
          });

      //button 3
      display_element.querySelector('#jspsych-free-sort-done-btn3').addEventListener('click', function(){
          var end_time = (new Date()).getTime();
          var rt = end_time - start_time;
          var trial_data = {
                "expected": right_button,
                "button_selection": JSON.stringify(3),
                "rt": rt,
                "Buttonnumber": 3,
                "trial_num": counter_loop
            };
            if (right_button == trial_data.Buttonnumber){
              console.log(trial_data.Buttonnumber);
              counter_right++;
              trial_data["correct"] = true;

            }
            else {
              console.log(trial_data.Buttonnumber);
              trial_data["correct"] = false;
            //  alert("Leider falsch, am besten du versuchst es nochmal! Um das Training zu beenden ben\u00f6tigst Du 5 richtige Antworten");
            }
              // advance to next part
              display_element.innerHTML = '';
              jsPsych.finishTrial(trial_data);
            });

        //button 4
        display_element.querySelector('#jspsych-free-sort-done-btn4').addEventListener('click', function(){
          var end_time = (new Date()).getTime();
          var rt = end_time - start_time;
          var trial_data = {
                  "expected": right_button,
                  "button_selection": JSON.stringify(4),
                  "rt": rt,
                  "Buttonnumber": 4,
                  "trial_num": counter_loop
            };
            if (right_button == trial_data.Buttonnumber){
              console.log(trial_data.Buttonnumber);
              counter_right++;
              trial_data["correct"] = true;

            }
            else {
              console.log(trial_data.Buttonnumber);
              trial_data["correct"] = false;
            //  alert("Leider falsch, am besten du versuchst es nochmal! Um das Training zu beenden ben\u00f6tigst Du 5 richtige Antworten");
            }
              // advance to next part
              display_element.innerHTML = '';
              jsPsych.finishTrial(trial_data);
            });

            //button 5
        display_element.querySelector('#jspsych-free-sort-done-btn5').addEventListener('click', function(){
            var end_time = (new Date()).getTime();
            var rt = end_time - start_time;
            var trial_data = {
                  "expected": right_button,
                  "button_selection": JSON.stringify(5),
                  "rt": rt,
                  "Buttonnumber": 5,
                  "trial_num": counter_loop
              };
              if (right_button == trial_data.Buttonnumber){
                console.log(trial_data.Buttonnumber);
                counter_right++;
                trial_data["correct"] = true;

              }
              else {
                console.log(trial_data.Buttonnumber);
                trial_data["correct"] = false;
              //  alert("Leider falsch, am besten du versuchst es nochmal! Um das Training zu beenden ben\u00f6tigst Du 5 richtige Antworten");
              }
                // advance to next part
                display_element.innerHTML = '';
                jsPsych.finishTrial(trial_data);
              });

              console.log('richtige: ' + counter_right + " von " );
 };

   return plugin;
 })();
