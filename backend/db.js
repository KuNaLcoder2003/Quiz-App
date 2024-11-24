
require('dotenv').config();
const mongoose = require('mongoose')
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const User_Schema = new mongoose.Schema({
    first_name : {
        type : String,
        required :true,
        unique : false
    },
    last_name : {
        type : String,
        required :true,
        unique : false
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required :true,
    },
    avvatar_url : {
        type : String,
        required : false,
    },
    previous_records : [{
        quiz_details : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'quiz_table',
        },
        marks : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'marks_table',
        }
    }]
} , {timestamps : true})

const Quiz_Schema = new mongoose.Schema({
    quiz_name : {
        type : String,
        required : true,
        unique : false,
    },
    quiz_image : {
        type : String,
        required : false,
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users_table',
    }],

    questions : [{
        question : {
            type : String,
            required : true,
            unique : true
        } , 
        answer : {
            type : String,
            required : true
        }
    }]

} , {timestamps : true});

const Marks_schema = new mongoose.Schema({
    quiz_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'quiz_table'
    },
    
    users_marks : [{
        user_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users_table',
            required : true,
        },
        marks : {
            type : Number,
            required : true,
        }
    }],
    // user_id : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'users_table'
    // },
    // marks : {
    //     type : Number ,
    //     required : true
    // },

},{timestamps : true})

const Users = mongoose.model('users_table' , User_Schema);
const Quiz = mongoose.model('quiz_table' , Quiz_Schema);
const Marks = mongoose.model('marks_table' , Marks_schema);

module.exports = {
    Users,
    Quiz,
    Marks,
}
