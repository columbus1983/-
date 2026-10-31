import test from 'node:test';
import assert from 'node:assert/strict';
import { generateFarmerAutoReply, formatChatTimestamp, INITIAL_CHAT_THREADS, INITIAL_CHAT_MESSAGES } from './chatUtils';

test('INITIAL_CHAT_THREADS contains both group and direct threads', () => {
  assert.ok(INITIAL_CHAT_THREADS.length >= 3);
  const groupThread = INITIAL_CHAT_THREADS.find((t) => t.type === 'group');
  const directThread = INITIAL_CHAT_THREADS.find((t) => t.type === 'direct');

  assert.ok(groupThread, 'Must have a community group thread');
  assert.ok(directThread, 'Must have direct farmer threads');
  assert.equal(groupThread?.id, 'thread-group-1');
});

test('generateFarmerAutoReply produces context-aware responses in Arabic', () => {
  const replyOil = generateFarmerAutoReply('خالتي فاطمة', 'هل زيت الزيتونة متوفر؟');
  assert.ok(replyOil.includes('زيت الزيتونة') || replyOil.includes('عصرة أولى'));

  const replyTime = generateFarmerAutoReply('عم سالم', 'وقتاش وقت الاستلام في السانية؟');
  assert.ok(replyTime.includes('السانية') || replyTime.includes('16:30'));

  const defaultReply = generateFarmerAutoReply('الحبيب', 'السلام عليكم');
  assert.ok(defaultReply.length > 10);
});

test('INITIAL_CHAT_MESSAGES maps to valid thread IDs', () => {
  const groupMessages = INITIAL_CHAT_MESSAGES['thread-group-1'];
  assert.ok(groupMessages && groupMessages.length >= 2);
  assert.equal(groupMessages[0].threadId, 'thread-group-1');
});
