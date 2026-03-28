/**
 * This file is intended to create interesting test cases for searches against
 * a base class with a limited number of overrides.
 **/

class DoubleBase {
 public:
  virtual void doublePure() = 0;
};

class DoubleSubOne : public DoubleBase {
 public:
  void doublePure() override {
    // Sub one.
  }
};

class DoubleSubTwo : public DoubleBase {
 public:
  void doublePure() override {
    // Sub two.
  }
};

class TripleBase {
 public:
  virtual void triplePure() = 0;
};

class TripleSubOne : public TripleBase {
 public:
  void triplePure() override {
    // Triple sub one.
  }
};

class TripleSubTwo : public TripleBase {
 public:
  void triplePure() override {
    // Triple sub two.
  }
};

class TripleSubThree : public TripleBase {
 public:
  void triplePure() override {
    // Triple sub three.
  }
};

void generateDoubleUses(void) {
  DoubleBase* subOne = new DoubleSubOne();
  DoubleBase* subTwo = new DoubleSubTwo();
  DoubleSubOne explicitOne;
  DoubleSubTwo explicitTwo;

  subOne->doublePure();
  subTwo->doublePure();

  explicitOne.doublePure();
  explicitTwo.doublePure();
}

void generateTripleUses(void) {
  TripleBase* subOne = new TripleSubOne();
  TripleBase* subTwo = new TripleSubTwo();
  TripleBase* subThree = new TripleSubThree();
  TripleSubOne explicitOne;
  TripleSubTwo explicitTwo;
  TripleSubThree explicitThree;

  subOne->triplePure();
  subTwo->triplePure();
  subThree->triplePure();

  explicitOne.triplePure();
  explicitTwo.triplePure();
  explicitThree.triplePure();
}

class SingleBase {
 public:
  virtual void singlePure() = 0;
};

class SingleSub : public SingleBase {
 public:
  void singlePure() override {}
};

class TwentyBase {
 public:
  virtual void twentyPure() = 0;
};

#define TWENTY_SUB(N)                                                         \
  class TwentySub ## N : public TwentyBase {                                  \
   public:                                                                    \
    void twentyPure() override {}                                             \
  }

class TwentySub0 : public TwentyBase {
 public:
  void twentyPure() override {}
};

class TwentySub1 : public TwentyBase {
 public:
  void twentyPure() override {}
};

class TwentySub2 : public TwentyBase {
 public:
  void twentyPure() override {}
};

class TwentySub3 : public TwentyBase {
 public:
  void twentyPure() override {}
};

class TwentySub4 : public TwentyBase {
 public:
  void twentyPure() override {}
};

class TwentySub5 : public TwentyBase {
 public:
  void twentyPure() override {}
};

TWENTY_SUB(6);
TWENTY_SUB(7);
TWENTY_SUB(8);
TWENTY_SUB(9);
TWENTY_SUB(10);
TWENTY_SUB(11);
TWENTY_SUB(12);
TWENTY_SUB(13);
TWENTY_SUB(14);
TWENTY_SUB(15);
TWENTY_SUB(16);
TWENTY_SUB(17);
TWENTY_SUB(18);
TWENTY_SUB(19);
