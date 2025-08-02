import db, { genId } from '../../src/modules/db';
import bcrypt from 'bcryptjs';

const run = async () => {
  await db.post.deleteMany();
  await db.user.deleteMany();

  const hashedPassword = await bcrypt.hash('admin', 10);

  await db.user.createMany({
    data: [
      // Professores (ADMIN)
      {
        name: 'Sadi Carnot',
        email: 'sadi.carnot@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        name: 'Fiódor Dostoiévski',
        email: 'fiodor.d@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        name: 'Friedrich Nietzsche',
        email: 'nietzsche@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        name: 'Virginia Woolf',
        email: 'virginia.woolf@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        name: 'Homer',
        email: 'homer@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },

      // Alunos (MEMBER)
      {
        name: 'Dante Alighieri',
        email: 'dante@example.com',
        password: hashedPassword,
        role: 'MEMBER',
      },
      {
        name: 'Jean-Paul Sartre',
        email: 'sartre@example.com',
        password: hashedPassword,
        role: 'MEMBER',
      },
      {
        name: 'Simone de Beauvoir',
        email: 'simone@example.com',
        password: hashedPassword,
        role: 'MEMBER',
      },
      {
        name: 'Fernando Pessoa',
        email: 'pessoa@example.com',
        password: hashedPassword,
        role: 'MEMBER',
      },
      {
        name: 'Sylvia Plath',
        email: 'plath@example.com',
        password: hashedPassword,
        role: 'MEMBER',
      },
    ],
  });

  const createdProfessors = await db.user.findMany({
    where: { role: 'ADMIN' },
  });

  await db.post.createMany({
    data: [
      {
        id: genId(),
        slug: 'fundamentos-de-termodinamica',
        title: 'Fundamentos de Termodinâmica',
        content: `Reflexões sobre a Potência Motriz do Fogo, escrito por Sadi Carnot, é uma obra crucial na compreensão do funcionamento das máquinas térmicas. Carnot explica como o calor, ao passar de um corpo quente para um corpo frio, pode ser transformado em trabalho útil. Seu estudo serviu de base para a formulação da segunda lei da termodinâmica, introduzindo conceitos como o ciclo de Carnot e a eficiência térmica. Sua visão teórica lançou os alicerces para a ciência da termodinâmica moderna, contribuindo diretamente para o desenvolvimento industrial.`,
        author: 'Sadi Carnot',
        userId: createdProfessors.find((u) => u.name === 'Sadi Carnot')?.id,
        publishedAt: new Date(),
      },
      {
        id: genId(),
        slug: 'introducao-a-literatura-russa',
        title: 'Introdução à Literatura Russa',
        content: `Fiódor Dostoiévski é um dos pilares da literatura russa, explorando temas como a moralidade, a fé e os dilemas existenciais. Em "Os Irmãos Karamazov", ele mergulha na psique humana através do conflito entre os irmãos, representando diferentes aspectos da alma russa. "Crime e Castigo" é outro marco, abordando o peso da culpa e a busca por redenção. Suas obras trazem personagens atormentados e profundas reflexões filosóficas, inspirando gerações de leitores e críticos a refletir sobre a complexidade humana.`,
        author: 'Fiódor Dostoiévski',
        userId: createdProfessors.find((u) => u.name === 'Fiódor Dostoiévski')
          ?.id,
        publishedAt: new Date(),
      },
      {
        id: genId(),
        slug: 'assim-falou-zaratustra',
        title: 'Assim Falou Zaratustra',
        content: `Friedrich Nietzsche, em "Assim Falou Zaratustra", apresenta suas ideias filosóficas por meio da figura de Zaratustra, um profeta que proclama a morte de Deus e a ascensão do super-homem. Nietzsche desafia as concepções tradicionais de moralidade, criticando valores cristãos e propondo uma vida afirmativa baseada no eterno retorno. A obra é repleta de simbolismo e metáforas, questionando o sentido da existência e encorajando o homem a superar suas limitações para atingir o máximo potencial.`,
        author: 'Friedrich Nietzsche',
        userId: createdProfessors.find((u) => u.name === 'Friedrich Nietzsche')
          ?.id,
        publishedAt: new Date(),
      },
      {
        id: genId(),
        slug: 'ao-faro-de-um-livro',
        title: 'Ao Faro de um Livro',
        content: `Virginia Woolf, uma das maiores expoentes do modernismo, revoluciona a narrativa em "Ao Farol". A obra explora a consciência de seus personagens com uma escrita fluida e introspectiva, abordando temas como o tempo, a memória e as relações familiares. Woolf utiliza o fluxo de consciência para apresentar o mundo interno de cada personagem, revelando suas percepções fragmentadas e subjetivas. Sua prosa poética desafia as convenções literárias da época e oferece uma análise sensível da condição humana.`,
        author: 'Virginia Woolf',
        userId: createdProfessors.find((u) => u.name === 'Virginia Woolf')?.id,
        publishedAt: new Date(),
      },
      {
        id: genId(),
        slug: 'a-ilada',
        title: 'A Ilíada',
        content: `A Ilíada, atribuída a Homero, é uma das obras fundadoras da literatura ocidental. O épico narra os eventos da Guerra de Troia, concentrando-se na ira de Aquiles e suas consequências. A obra apresenta heróis, deuses e batalhas grandiosas, explorando temas como a honra, a glória e o destino inevitável dos homens. A linguagem poética e as descrições vívidas transformam a Ilíada em uma celebração da coragem e um testemunho do poder duradouro das histórias contadas ao longo das gerações.`,
        author: 'Homer',
        userId: createdProfessors.find((u) => u.name === 'Homer')?.id,
        publishedAt: new Date(),
      },
      {
        id: genId(),
        slug: 'a-divina-comedia',
        title: 'A Divina Comédia',
        content: `Dante Alighieri, em "A Divina Comédia", cria uma alegoria poética que descreve sua jornada através do Inferno, Purgatório e Paraíso. A obra, dividida em três partes, oferece uma visão da alma humana e da justiça divina. Cada canto apresenta punições, expiações e recompensas, refletindo a visão medieval do pecado e da redenção. Dante conduz o leitor por um percurso simbólico, narrando com precisão os detalhes de cada reino e imortalizando figuras históricas e mitológicas em uma das maiores epopeias literárias já escritas.`,
        author: 'Dante Alighieri',
        userId: createdProfessors.find((u) => u.name === 'Dante Alighieri')?.id,
        publishedAt: new Date(),
      },
    ],
  });

  console.log('Seeded database with professors and students!');
};

if (require.main === module) {
  run().then(() => {
    process.exit();
  });
}
