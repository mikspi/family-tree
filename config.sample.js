export default {
  title: 'Family',
  data: [{
    name: '0',
    textA: 'Giovanni',
    textB: 'Maria',
    parent: 'null',
    _children: [
      {
        name: '1',
        textA: 'Giuseppe',
        textB: '(1840-1920)',
        textC: 'Laura',
        textD: '(1850-1925)',
        parent: '0',
        _children: [
          {
            name: '2',
            textA: 'Giovanni',
            textB: 'Giulia',
            parent: '1',
          },
          {
            name: '3',
            textA: 'Roberta',
            textB: '(1894)',
            parent: '1',
          },
        ],
      },
    ],
  }],
};
