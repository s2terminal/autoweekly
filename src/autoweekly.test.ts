import { getNextFriday } from './autoweekly';
import dayjs from 'dayjs';

test('getNextFriday', () => {
  const thu1 = dayjs('2021-03-11', 'YYYY-MM-DD');//4: +0+1
  const fri1 = dayjs('2021-03-12', 'YYYY-MM-DD');//5: +7+0
  const sat1 = dayjs('2021-03-13', 'YYYY-MM-DD');//6: +7-1
  const sun2 = dayjs('2021-03-14', 'YYYY-MM-DD');//0: +7-2
  const mon2 = dayjs('2021-03-15', 'YYYY-MM-DD');//1: +7-3
  const fri2 = dayjs('2021-03-19', 'YYYY-MM-DD');
  expect(getNextFriday(thu1).toISOString()).toBe(fri1.toISOString());
  expect(getNextFriday(fri1).toISOString()).toBe(fri2.toISOString());
  expect(getNextFriday(sat1).toISOString()).toBe(fri2.toISOString());
  expect(getNextFriday(sun2).toISOString()).toBe(fri2.toISOString());
  expect(getNextFriday(mon2).toISOString()).toBe(fri2.toISOString());
});
