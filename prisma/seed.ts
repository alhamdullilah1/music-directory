import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  await prisma.gearEvent.deleteMany();
  await prisma.chordEvent.deleteMany();
  await prisma.song.deleteMany();

  const getImg = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  const songs = [
    {
      title: 'Natsu O Dakishimete',
      artist: 'TUBE',
      genre: 'J-Pop',
      scale: 'G Major',
      audioUrl: '_t45ZxZRGYQ',
      imageUrl: getImg('_t45ZxZRGYQ'),
      paletteTheme: 'sunset-warm',
      chords: {
        create: [
          { timestamp: 2, chordName: 'Gmaj7' },
          { timestamp: 5, chordName: 'Cmaj7' },
          { timestamp: 8, chordName: 'Am7' },
          { timestamp: 12, chordName: 'D7' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Fender Stratocaster', pedal: 'Boss CE-2 Chorus', amp: 'Roland JC-120' },
          { timestamp: 10, guitar: 'Fender Stratocaster', pedal: 'Ibanez Tube Screamer', amp: 'Roland JC-120' },
        ]
      }
    },
    {
      title: 'Midnight City',
      artist: 'M83',
      genre: 'Electronic',
      scale: 'B Minor',
      audioUrl: 'dX3k_QDnzHE',
      imageUrl: getImg('dX3k_QDnzHE'),
      paletteTheme: 'neon-cyberpunk',
      chords: {
        create: [
          { timestamp: 3, chordName: 'Bm' },
          { timestamp: 7, chordName: 'G' },
          { timestamp: 11, chordName: 'D' },
          { timestamp: 15, chordName: 'A' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Synthesizer', pedal: 'Reverb', amp: 'Direct Input' }
        ]
      }
    },
    {
      title: 'Autumn Leaves',
      artist: 'Miles Davis',
      genre: 'Jazz',
      scale: 'G Minor',
      audioUrl: 'u37RF5xKNq8',
      imageUrl: getImg('u37RF5xKNq8'),
      paletteTheme: 'vintage-sepia',
      chords: {
        create: [
          { timestamp: 1, chordName: 'Cm7' },
          { timestamp: 4, chordName: 'F7' },
          { timestamp: 7, chordName: 'Bbmaj7' },
          { timestamp: 10, chordName: 'Ebmaj7' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Archtop Jazz', pedal: 'None', amp: 'Fender Twin Reverb' }
        ]
      }
    },
    {
      title: 'Everlong',
      artist: 'Foo Fighters',
      genre: 'Rock',
      scale: 'D Major',
      audioUrl: 'eBG7P-K-r1Y',
      imageUrl: getImg('eBG7P-K-r1Y'),
      paletteTheme: 'midnight-blue',
      chords: {
        create: [
          { timestamp: 2, chordName: 'Dmaj7' },
          { timestamp: 6, chordName: 'Badd9' },
          { timestamp: 10, chordName: 'Gmaj7' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Gibson ES-335', pedal: 'ProCo Rat', amp: 'Mesa Boogie Dual Rectifier' }
        ]
      }
    },
    {
      title: 'Superstition',
      artist: 'Stevie Wonder',
      genre: 'Funk',
      scale: 'Eb Minor Pentatonic',
      audioUrl: '0CFuCYNx-1g',
      imageUrl: getImg('0CFuCYNx-1g'),
      paletteTheme: 'sunset-warm',
      chords: {
        create: [
          { timestamp: 1, chordName: 'Ebm7' },
          { timestamp: 8, chordName: 'Bb7' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Hohner Clavinet', pedal: 'Wah', amp: 'Fender Bassman' }
        ]
      }
    },
    {
      title: 'Neon',
      artist: 'John Mayer',
      genre: 'Acoustic',
      scale: 'C Major',
      audioUrl: 'eXBNx9JL-_w',
      imageUrl: getImg('eXBNx9JL-_w'),
      paletteTheme: 'forest-green',
      chords: {
        create: [
          { timestamp: 2, chordName: 'Cmaj7' },
          { timestamp: 5, chordName: 'Ebmaj7' },
          { timestamp: 8, chordName: 'Fmaj7' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Martin OM-28', pedal: 'Compressor', amp: 'Acoustic DI' }
        ]
      }
    },
    {
      title: 'Texas Flood',
      artist: 'Stevie Ray Vaughan',
      genre: 'Blues',
      scale: 'G Blues',
      audioUrl: 'tWLw7nozO_U',
      imageUrl: getImg('tWLw7nozO_U'),
      paletteTheme: 'midnight-blue',
      chords: {
        create: [
          { timestamp: 1, chordName: 'G7' },
          { timestamp: 5, chordName: 'C7' },
          { timestamp: 9, chordName: 'G7' },
          { timestamp: 13, chordName: 'D7' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Fender Stratocaster', pedal: 'Tube Screamer TS808', amp: 'Fender Super Reverb' }
        ]
      }
    },
    {
      title: 'Master of Puppets',
      artist: 'Metallica',
      genre: 'Metal',
      scale: 'E Minor',
      audioUrl: 'kV-2Q8QtCY4',
      imageUrl: getImg('kV-2Q8QtCY4'),
      paletteTheme: 'neon-cyberpunk',
      chords: {
        create: [
          { timestamp: 2, chordName: 'E5' },
          { timestamp: 5, chordName: 'D5' },
          { timestamp: 8, chordName: 'C5' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'ESP Explorer', pedal: 'Distortion', amp: 'Mesa Boogie Mark IIC+' }
        ]
      }
    },
    {
      title: 'Jolene',
      artist: 'Dolly Parton',
      genre: 'Country',
      scale: 'C# Minor',
      audioUrl: 'Ixrje2rXLMA',
      imageUrl: getImg('Ixrje2rXLMA'),
      paletteTheme: 'vintage-sepia',
      chords: {
        create: [
          { timestamp: 1, chordName: 'C#m' },
          { timestamp: 4, chordName: 'E' },
          { timestamp: 7, chordName: 'B' },
          { timestamp: 10, chordName: 'C#m' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Gibson J-45', pedal: 'None', amp: 'Acoustic DI' }
        ]
      }
    },
    {
      title: 'Redbone',
      artist: 'Childish Gambino',
      genre: 'R&B',
      scale: 'Bb Minor',
      audioUrl: 'nxuzYWcY2O0',
      imageUrl: getImg('nxuzYWcY2O0'),
      paletteTheme: 'sunset-warm',
      chords: {
        create: [
          { timestamp: 2, chordName: 'Bbm7' },
          { timestamp: 6, chordName: 'Eb7' },
          { timestamp: 10, chordName: 'Abmaj7' },
        ]
      },
      gears: {
        create: [
          { timestamp: 0, guitar: 'Fender Stratocaster', pedal: 'Mu-Tron III', amp: 'Fender Twin Reverb' }
        ]
      }
    }
  ];

  for (const song of songs) {
    await prisma.song.create({
      data: song,
    });
  }

  console.log('Database seeded with 10 songs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
