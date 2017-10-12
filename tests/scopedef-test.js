import {
  createScopeDefinition,
  createScopeDefinitions
} from '../src/scope-reporter';
import test from 'ava';

test('scope single attributes present', t => {
  const fileScopeDef = createScopeDefinition(
    'file',
    {
      name: {}
    },
    'file: ${name}'
  );

  t.is(fileScopeDef.name, 'file');
  t.is(fileScopeDef.format, 'file: ${name}');
  t.deepEqual(fileScopeDef.properties, {
    name: {}
  });

  t.is(fileScopeDef.toString(), 'file');
});

test('scope multiple attributes present', t => {
  const scopeDefs = createScopeDefinitions({
    file: {
      properties: {
        name: {}
      },
      format: 'file: ${name}'
    },
    line: {
      properties: {
        number: {}
      },
      format: 'line: ${number}'
    }
  });
  t.is(scopeDefs.length, 2);
});
