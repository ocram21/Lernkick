import {emptyLearning,type UserData}from'../lib/schema';
import {emptyActivities}from'./schema';
export function resetLearningProgress(data:UserData):UserData{
 const activities=emptyActivities();activities.migrated=true;activities.hangman.level=data.activities.hangman.level;activities.vocabulary.enabled={...data.activities.vocabulary.enabled};activities.vocabulary.level=data.activities.vocabulary.level;
 return{...data,rounds:{},cardSession:null,progress:{},scores:{math:0,german:0,social:0,biology:0,geography:0},learning:{...emptyLearning(),preferences:data.learning.preferences},study:{...data.study,reviews:{}},activities};
}
