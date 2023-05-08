# `llvm::PassInfoMixin` とは何なのか

こんな感じで適当にパスを書いて，それを登録すれば動いてしまう．
なんとも便利だが，なぜそんな事ができるのか．
いざ，アマゾンの奥地へ．

```cpp
struct MyPass: public llvm::PassInfoMixin<MyPass> {
    llvm::PreservedAnalyses run(llvm::Function &F, llvm::FunctionAnalysisManager &FAM);
    static bool isRequired() { return true; }
};
```

```cpp
extern "C" LLVM_ATTRIBUTE_WEAK
PassPluginLibraryInfo llvmGetPassPluginInfo() {
    return {
        LLVM_PLUGIN_API_VERSION, "MyPass", "v0.1",
        [](PassBuilder &PB) {
            PB.registerPipelineParsingCallback(
                [](
                    StringRef Name,
                    FunctionPassManager &FPM,
                    ArrayRef<PassBuilder::PipelineElement>
                ) {
                    if (Name == "mypass") {
                        FPM.addPass(MyPass());
                        return true;
                    }
                    return false;
                }
            );
        }
    };
}
```

## `FunctionPassManager::addPass`

```cpp
using FunctionPassManager = PassManager<Function>;

template <typename IRUnitT,
          typename AnalysisManagerT = AnalysisManager<IRUnitT>,
          typename... ExtraArgTs>
class PassManager : public PassInfoMixin<
                        PassManager<IRUnitT, AnalysisManagerT, ExtraArgTs...>> {
public:
  template <typename PassT>
  LLVM_ATTRIBUTE_MINSIZE
      std::enable_if_t<!std::is_same<PassT, PassManager>::value>
      addPass(PassT &&Pass) {
    using PassModelT =
        detail::PassModel<IRUnitT, PassT, PreservedAnalyses, AnalysisManagerT,
                          ExtraArgTs...>;
    // Do not use make_unique or emplace_back, they cause too many template
    // instantiations, causing terrible compile times.
    Passes.push_back(std::unique_ptr<PassConceptT>(
        new PassModelT(std::forward<PassT>(Pass))));
  }
};
```

`MyPass()` で作ったインスタンスが `PassModel` のコンストラクタに渡されていることがわかる．

```cpp
/* 一部メソッドは省略している */
template <typename IRUnitT, typename PassT, typename PreservedAnalysesT,
          typename AnalysisManagerT, typename... ExtraArgTs>
struct PassModel : PassConcept<IRUnitT, AnalysisManagerT, ExtraArgTs...> {
  explicit PassModel(PassT Pass) : Pass(std::move(Pass)) {}

  PreservedAnalysesT run(IRUnitT &IR, AnalysisManagerT &AM,
                         ExtraArgTs... ExtraArgs) override {
    return Pass.run(IR, AM, ExtraArgs...);
  }

  PassT Pass;
};
```
