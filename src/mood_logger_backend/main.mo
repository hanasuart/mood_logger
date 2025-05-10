import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {
  type MoodEntry = {
    emoji : Text;
    timestamp : Time.Time;
  };

  stable var moods : [MoodEntry] = [];

  public func logMood(emoji : Text) : async () {
    let newMood : MoodEntry = {
      emoji = emoji;
      timestamp = Time.now();
    };
    moods := Array.append(moods, [newMood]);
  };

  public query func getMoodStats() : async [(Text, Nat)] {
    let moodCounts = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);

    for (entry in moods.vals()) {
      let count = switch (moodCounts.get(entry.emoji)) {
        case (?c) c;
        case null 0;
      };
      moodCounts.put(entry.emoji, count + 1);
    };

    var results : [(Text, Nat)] = [];
    for ((emoji, count) in moodCounts.entries()) {
      results := Array.append(results, [(emoji, count)]);
    };

    return results;
  };
};
