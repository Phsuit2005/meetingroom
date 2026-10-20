import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,validateScores,summarizeSurveys} from '../src/services/feedbackLogic.js';
const scores=n=>Object.fromEntries(QUESTIONS.map(([k])=>[k,n]));
test('empty evaluations have no invented average',()=>assert.deepEqual(summarizeSurveys([]),{count:0,means:Object.fromEntries(QUESTIONS.map(([k])=>[k,null])),average:null,distribution:[0,0,0,0,0]}));
test('actual survey scores produce correct mean and distribution',()=>{const s=summarizeSurveys([{scores:scores(5)},{scores:scores(3)}]);assert.equal(s.count,2);assert.equal(s.average,4);assert.equal(s.means.overall,4);assert.deepEqual(s.distribution,[0,0,1,0,1])});
test('all survey questions are required integer ratings from one to five',()=>{assert.doesNotThrow(()=>validateScores(scores(1)));assert.doesNotThrow(()=>validateScores(scores(5)));for(const r of [{},scores(0),scores(6),scores(2.5),{...scores(3),ease:'3'}])assert.throws(()=>validateScores(r))});
test('incomplete stored responses do not enter evaluation results',()=>{assert.equal(summarizeSurveys([{scores:{overall:5}},{scores:scores(4)}]).count,1)});
