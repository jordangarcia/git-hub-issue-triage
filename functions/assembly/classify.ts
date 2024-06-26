import { models } from "@hypermode/functions-as";
import { ClassificationModel } from "@hypermode/models-as/models/experimental/classification";

// This function classifies an issue based on its title.
// The model used is tailored for GitHub issues.
// See https://huggingface.co/AntoineMC/distilbart-mnli-github-issues

export function classifyIssue(
  id: string,
  title: string,
  description: string,
): string {
  console.log(`Classifying issue ${id}`);
  const summary = `${title}\n${description}`;

  const model = models.getModel<ClassificationModel>("issue-classifier");
  const input = model.createInput([summary]);
  const output = model.invoke(input).predictions[0];

  console.log(`Issue ${id} classified as ${output.label}`);
  return output.label;
}
