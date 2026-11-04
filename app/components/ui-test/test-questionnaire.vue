<script setup lang="ts">
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Questionnaire>
    <QuestionnaireProgress>1 of 3</QuestionnaireProgress>
    <QuestionnaireItem name="favorite-color">
      <QuestionnaireTitle>What is your favorite color?</QuestionnaireTitle>
      <QuestionnaireDescription>
        Select the color you like best. This helps us personalize your experience.
      </QuestionnaireDescription>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="red">
          <div>Red</div>
        </QuestionnaireChoice>
        <QuestionnaireChoice value="blue">
          <div>Blue</div>
        </QuestionnaireChoice>
        <QuestionnaireChoice value="green">
          <div>Green</div>
        </QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError>Please select an option</QuestionnaireError>
    </QuestionnaireItem>
    <QuestionnairePrevious>Back</QuestionnairePrevious>
    <QuestionnaireNext>Next</QuestionnaireNext>
  </Questionnaire>
  </div>
</template>
