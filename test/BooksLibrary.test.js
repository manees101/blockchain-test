const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BooksLibrary', function () {
  let BooksLibrary, lib, owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    BooksLibrary = await ethers.getContractFactory('BooksLibrary');
    lib = await BooksLibrary.deploy();
    await lib.waitForDeployment();
  });

  it('adds a global book once per index', async function () {
    await expect(lib.addBook(1, 'Author A', 'Title A')).to.emit(lib, 'bookAdded');

    await expect(lib.addBook(1, 'Author B', 'Title B')).to.be.revertedWith(
      'Book already exist at this index'
    );
  });

  it('allows a user to add and read their own books', async function () {
    const ids = [10, 11];
    await lib.connect(user1).addMyBook(ids[0], 'UA', 'TA');
    await lib.connect(user1).addMyBook(ids[1], 'UB', 'TB');

    const count = await lib.connect(user1).getMybooksCount();
    expect(count).to.equal(2);

    const books = await lib.connect(user1).getMyBooks(ids);
    expect(books.length).to.equal(2);
    expect(books[0].author).to.equal('UA');
    expect(books[0].title).to.equal('TA');
  });

  it('reverts when fetching a non-existent myBook', async function () {
    await lib.connect(user1).addMyBook(1, 'UA', 'TA');
    await expect(lib.connect(user1).getMyBooks([1, 2])).to.be.revertedWith(
      'Book does not exist at this ID'
    );
  });
});
