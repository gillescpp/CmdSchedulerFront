//init elements
export function NewModel(name) {
  if (name == "QUEUE") {
    return {
      "id": 0,
      "lib": "",
      "size": 0,
      "timeout": 0, //en ms
      "paused": false,
      "paused_from": null, //readonly
      "info": "" //readonly
    };
  }
  else if (name == "TASK") {
    return {
      "id": 0,
      "lib": "",
      "type": "CmdTask",
      "timeout": 0, //en ms
      "log_store": "",
      "cmd": "",
      "args": [], //tableau de str
      "start_in": "",
      "exec_on": [1],
      "info": "" //readonly
    };
  }
  else if (name == "USER") {
    return {
      "id": 0,
      "name": "",
      "login": "",
      "password": "",
      "rightlevel": 0,
      "deleted": false,
      "info": "" //readonly
    };
  }
  else if (name == "TAGS") {
    return {
      "id": 0,
      "lib": "",
      "group": "",
      "info": "" //readonly
    };
  }
  else if (name == "AGENT") {
    return {
      "id": 0,
      "host": "https:\/\/localhost:8800",
      "apikey": "",
      "certsign": "",
      "certsigneval": "", //readonly
      "tls": false,//readonly
      "evalresultaccess": false, //readonly
      "evalresultauth": false, //readonly
      "evalresultcert": false, //readonly
      "evalresultinfo": "", //readonly     
      "deleted": false,
      "info": "" //readonly
    };
  }
  else if (name == "CONFIG") {
    return {
      "key": "",
      "value": ""
    };
  }
  else if (name == "TASKFLOW") {
    return {
      "id": 0,
      "lib": "",
      "tags": [], //tableau de int
      "named_args": {}, //map clé=valeur
      "activ": true,
      "manuallaunch": false,     
      "scheduleid": 0,
      "err_management": 0,
      "queueid": 0,
      "last_start": null, //readonly
      "last_stop": null, //readonly
      "last_result": 0, //readonly
      "last_msg": "", //readonly 
      "detail": [ NewModel('TASKFLOW_D') ],      //TaskFlowsDetail
      "info": "" //readonly
    };
  }
  else if (name == "TASKFLOW_D") {
    return {
      "idx": 0, //à partir de 1
      "taskid": 0,
      "nexttaskid_ok": 0, //0=terminé ok, -1=terminé err
      "nexttaskid_fail": -1, //0=terminé ok, -1=terminé err
      "retryif_fail": 0
    };
  }
  else if (name == "SCHED") {
    return {
      "id": 0,
      "lib": "",
      "is_period": false,
      "time_zone": "",
      "detail": [ NewModel('SCHED_D') ], //SchedulerDetail
      "info": "" //readonly
    };
  }
  else if (name == "SCHED_D") {
    return {
      "interval": 60, // en min, ou 0 si heures fixe
      "hours": "", //(liste horaire d'exec 08:00:05, 10:00:00 (shed type heure fixe)
      "fixedinterval": 0, //(mode interval)
      "intervalhours": "", //(plages horaires mode interval 08:00:05-10:00:00,14:00:00-18:00:00)
      "months": "*", // mois d'exex format JFMAMJJASOND : "01000100000" ou "*" pour tous
      "weekdays": "*", //jours d'exex format LMMJVSD : "1111100" ou "*" pour tous
      "monthdays": "*" //jours du mois sous forme de n° : "1,15", et ou code "1MON, 2TUE, FIRST, LAST"
    };
  }
  return {};
}

