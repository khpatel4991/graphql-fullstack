import 'dotenv/config';
import { client } from '../client';
import { gql } from 'apollo-server';
import { getCards, getLocations } from '../crApi';
import { Location } from '../entity/Clan';
import { Card } from '../entity/Player';

const cardMutation = (c: Card, i: number) =>
  /* GraphQL */ `
c${i}: CreateCard(id: ${c.id}, name: "${c.name}", maxLevel: ${
    c.maxLevel
  }, iconurl: "${c.iconUrls.medium}") {
  id
  name
  maxLevel
}
`.trim();

const locationMutation = (l: Location, i: number) =>
  /* GraphQL */ `
l${i}: CreateLocation(id: ${l.id}, name: "${l.name}", isCountry: ${
    l.isCountry
  }, countryCode: "${l.countryCode}") {
    id
    name
  }
`.trim();

const seed = async () => {
  console.time(`Seeding`);
  const cardQuery = /* GraphQL */ `
    query {
      cards: Card(offset: 0) {
        name
      }
    }
  `.trim();
  const cresult = await client.query({
    query: gql(cardQuery),
  });
  if (cresult.data.cards.length === 0) {
    const cards = await getCards();
    console.log(`Adding ${cards.length} cards`);
    const cm = cards.map(cardMutation);
    const cms = `mutation{${cm.join('')}}`;
    console.time(`Added ${cards.length} cards: `);
    await client.mutate({
      mutation: gql(cms),
    });
    console.timeEnd(`Added ${cards.length} cards: `);
  }
  const locationQuery = /* GraphQL */ `
    query {
      locations: Location(offset: 0) {
        name
      }
    }
  `.trim();
  const lresult = await client.query({
    query: gql(locationQuery),
  });
  if (lresult.data.locations.length === 0) {
    const locations = await getLocations();
    console.log(`Adding ${locations.length} locations`);
    const lm = locations.map(locationMutation);
    const lms = `mutation{${lm.join('')}}`;
    console.time(`Added ${locations.length} cards: `);
    await client.mutate({
      mutation: gql(lms),
    });
    console.timeEnd(`Added ${locations.length} cards: `);
  }
  console.timeEnd(`Seeding`);
};

seed().catch(console.error);
